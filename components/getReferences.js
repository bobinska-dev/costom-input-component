import React from 'react'
import { withDocument } from 'part:@sanity/form-builder'
import {
    TextInput,
    Button,
    Box,
    Flex,
    Stack,
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
        const [loading, setLoading] = React.useState(false)

        const { _id, _type, title, mainImage, author } = document
        const options = props.type.options

        validateConfiguration(options)

        const reducer = React.useCallback(
            (queryResult) => options.reduceQueryResult(queryResult),
            [options.reduceQueryResult]
        )


        const handleChange = React.useCallback(
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

        const onChange = React.useCallback(
            (e) => handleChange(e.target.value),
            [handleChange]
        )

        const generate = React.useCallback(() => {
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
                console.log(items[0])
            })
        }, [handleChange, reducer, value, _id, _type])

        let TextComponent = type.name === 'text' ? Text : TextInput


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
                                    customValidity={errors.length > 0 ? errors[0].item.message : ''}
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
                <Flex align="center">
                    Text
                </Flex>
            </ThemeProvider>
        )
    }
)

export default withDocument(getReferences)
