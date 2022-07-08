import React, { useEffect, useState } from 'react'
import client from 'part:@sanity/base/client'
import {
    Flex,
    Stack,
    Card,
    Text,
    Heading,
    Box,
    Spinner
} from '@sanity/ui'

// withDocument is needed to get data like _id and _type from the parent doc 
import { withDocument } from 'part:@sanity/form-builder'


const PreviewRef = React.forwardRef((props) => {

    const document = props.document
    const { _id, _type } = document
    const options = props.type.options

    const [loading, setLoading] = useState(false)
    const [refDocs, setRefDocs] = useState([])


    useEffect(() => {

        //First we get the documents, that reference the doc we are using this component in

        const query = `*[_type == '${_type}' && _id == '${_id}' || _id == '${_id.replace(
            'drafts.', '')}'] {
                    _id,
                     title,
                     "references": *[references('${_id}')]{title, mainImage, author->, _type},
            }`

        setLoading(true)

        client.fetch(query).then((items) => {
            let record = items.find(({ _id }) => _id.includes('drafts'))
            if (!record) {
                // No draft, use the original:
                record = items[0]
            }

            // Then we get the references, and pass them into the refDocs state
            setRefDocs(record.references)
            setLoading(false)
        })
    }, [])

    // Because we are fancy 💅 we even get some more infos into a more polished format 
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <>
            <Heading as="h5" size={0}>This Category is referenced by the following Documents:</Heading>
            <Stack padding={4} space={[3, 3, 4, 5]}>
                {
                    refDocs.map((ref, index) => {
                        return <Flex key={ref._id}>
                            <Card >
                                <Text size={[2, 2, 3, 4]}>
                                    {index + 1}.{capitalizeFirstLetter(ref._type)}: {ref.title}
                                </Text>
                            </Card>
                            <Card paddingX={2} ><Text size={[1]} muted>
                                by {ref.author.name}
                            </Text></Card>

                        </Flex>
                    })
                }
            </Stack>
            {loading && (
                <Box paddingLeft={2}>
                    <Spinner muted />
                </Box>
            )}
        </>
    );
})
export default withDocument(PreviewRef)

/* 
PLANS:
    * Add prop-types to PreviewRef -> no crashing when adding new category!!!

    * Include basic Routing to List of references

    * Add some kind of visual representation? Maybe it is more important to work on the other things though, since this is only a test

    * Add Preview Pane for referenced docList

    * Add Links to docs & guides -> Better to understand 

*/