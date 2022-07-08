/* eslint-disable react/prop-types */
import React from "react";
import { FormField } from '@sanity/base/components'
import { TextInput, Flex, Text, Box, Card } from '@sanity/ui'
import PatchEvent, { set, unset } from '@sanity/form-builder/PatchEvent'
import { useId } from '@reach/auto-id'

const TwitterUrl = React.forwardRef((props, ref) => {

    const {
        type,
        value,
        readOnly,
        markers,
        presence,
        compareValue,
        onFocus,
        onBlur,
        placeholder,
        onChange
    } = props;

    const handleChange = React.useCallback(
        (event) => {
            const inputValue = event.currentTarget.value;
            onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()))
        },
        [onChange]
    )

    const inputId = useId()

    return (

        <FormField
            description={type.description}
            title={type.title}
            compareValue={compareValue}
            __unstable_markers={markers}
            __unstable_presence={presence}
            inputId={inputId}
        >
            <Flex>
                <Flex as={Card} paddingX={3} border borderRight={false} align='center'>
                    <Text size={1} muted >
                        {type.options?.prepend}
                    </Text>
                </Flex>
                <Box flex={1}>
                    <TextInput
                        id={inputId}
                        value={value}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                    />
                </Box>
            </Flex>
        </FormField>
    )
})

export default TwitterUrl