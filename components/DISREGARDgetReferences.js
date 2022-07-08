import React, { useEffect, useState, useCallback, forwardRef } from 'react'
import { withDocument } from 'part:@sanity/form-builder'
import {
    TextInput,
    Button,
    Box,
    Flex,
    Stack,
    Card,
    ThemeProvider,
    studioTheme,
    Switch,
    Text,
    Spinner,
} from '@sanity/ui'

import { Marker, Path, isValidationErrorMarker, SanityDocument } from '@sanity/types'
import DefaultFormField from 'part:@sanity/components/formfields/default'
import { FormField } from '@sanity/base/components'
// import styles from './ComputedField.css'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'

import client from 'part:@sanity/base/client'



const validateConfiguration = (options) => {
    const help = 'https://github.com/wildseansy/sanity-plugin-computed-field#readme'
    if (!options) {
        throw new Error(`ComputedField: options required. See ${help}`)
    } else {
        let breakingKey = null
        if (!options.documentQuerySelection) {
            breakingKey = 'documentQuerySelection'
        } else if (!options.reduceQueryResult) {
            breakingKey = 'reduceQueryResult'
        }
        if (breakingKey) {
            throw new Error(`ComputedField: options.${breakingKey} is required. Please follow ${help}`)
        }
    }
}

const getReferences = React.forwardRef(
    (props, forwardedRef) => {
        const { type, level, onFocus, value, markers } = props
        const document = props.document
        const errors = React.useMemo(() => markers.filter(isValidationErrorMarker), [markers])
        const [loading, setLoading] = useState(false)
        const [refDocs, setRefDocs] = useState({ numReferenced: 0, references: [], _id: '', title: '' })
        const { _id, _type, title, mainImage, author } = document
        const options = props.type.options

        validateConfiguration(options)

        const reducer = useCallback(
            (queryResult) => options.reduceQueryResult(queryResult),
            [options.reduceQueryResult]
        )


        const handleChange = useCallback(
            (val) => {
                let validated = val
                if (type.name === 'number') {
                    validated = parseFloat(val)
                    if (validated === NaN) {
                        validated = undefined
                    }
                }
                props.onChange(PatchEvent.from(validated ? set(validated) : unset()))

            },
            [props.onChange, type.name]
        )

        const onChange = useCallback(
            (e) => handleChange(e.target.value),
            [handleChange]
        )

        /* GET ALL REFERENCES ON LOAD */
        _id && _type ?
            useEffect(() => {
                const query = `*[_type == '${_type}' && _id == '${_id}' || _id == '${_id.replace(
                    'drafts.', '')}'] {
                    _id,
                     title,
                     "references": *[references('${_id}')]{title, mainImage, author},
                ${options.documentQuerySelection}
            }`
                setLoading(true)
                client.fetch(query).then((items) => {
                    let record = items.find(({ _id }) => _id.includes('drafts'))
                    if (!record) {
                        // No draft, use the original:
                        record = items[0]
                    }
                    const newValue = reducer(record)
                    handleChange(newValue)
                    setLoading(false)
                    setRefDocs(items[0])
                })

            }, []) : console.log(refDocs)

        const generate = useCallback(() => {
            const query = `*[_type == '${_type}' && _id == '${_id}' || _id == '${_id.replace(
                'drafts.',
                ''
            )}'] {
        _id,
         title,
         "references": *[references('${_id}')]{title, mainImage, author},
        ${options.documentQuerySelection}
       }`
            setLoading(true)
            client.fetch(query).then((items) => {
                let record = items.find(({ _id }) => _id.includes('drafts'))
                if (!record) {
                    // No draft, use the original:
                    record = items[0]
                }
                const newValue = reducer(record)

                if (newValue !== value) {
                    handleChange(newValue)
                }
                setLoading(false)
                setRefDocs(items[0])
                console.log(refDocs.references)
            })
        }, [handleChange, reducer, value, _id, _type])

        let TextComponent = type.name === 'text' ? Text : TextInput

        const refs = refDocs.references;

        return (
            <ThemeProvider theme={studioTheme}>
                <Flex align="center">
                    {/*                     <DefaultFormField
                        label={type.title || type.name}
                        level={level}
                        description={type.description}
                        presence={props.presence}
                        markers={props.markers}
                    > */}
                    <FormField
                        description={type.description}
                        title={type.title}
                        /* compareValue={compareValue} */
                        __unstable_markers={markers}
                    /*  __unstable_presence={presence}
                     inputId={inputId} */
                    >
                        {type.name === 'boolean' ? (
                            <Switch
                                checked={value}
                                disabled={!options.editable}
                                ref={forwardedRef}
                                onChange={options.editable ? onChange : null}
                            />
                        ) : (
                            <Flex align="center">

                                <TextComponent
                                    disabled={!options.editable}
                                    type={type.name === 'number' ? 'number' : 'text'}
                                    /* customValidity={errors.length > 0 ? errors[0].item.message : ''} */
                                    ref={forwardedRef}
                                    onChange={options.editable ? onChange : null}
                                    value={value || ''}
                                />
                                <Button
                                    mode="ghost"
                                    type="button"
                                    onClick={generate}
                                    onFocus={onFocus}
                                    text={options.buttonText || 'Reload'}
                                />
                                {loading && (
                                    <Box paddingLeft={2}>
                                        <Spinner muted />
                                    </Box>
                                )}
                            </Flex>
                        )}
                    </FormField>
                    {/* </DefaultFormField> */}

                </Flex>
                <Stack align="center" padding={3} space={3}>
                    {console.log(refDocs)}

                    {
                        refs.map(ref =>
                            <Text key={ref._id} >{ref.title}</Text>
                        )
                    }

                </Stack>
                <Text>{refDocs ? refDocs.title : 'no refs'}</Text>
            </ThemeProvider>
        )
    }
)

export default withDocument(getReferences)
