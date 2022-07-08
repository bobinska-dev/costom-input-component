import React, { useEffect, useState, useRef, useCallback } from "react";
import client from "part:@sanity/base/client";
import { withDocument } from 'part:@sanity/form-builder'
import {
    Heading
} from '@sanity/ui'

const CreateReferenceNumber = (props) => {

    const { title, order, document } = props;

    const getDocs = (document) => {
        return client.fetch(
            `*[_type == "post" && references(${document._id})]` //
        )
            .then(data => console.log(data));
    }
    console.log(getDocs(), document._id)


    return {
        inputComponent: (field) => (
            <Heading as={order} size={3} >
                {field.type?.title}
            </Heading>
        ),
        name: `heading-${title
            .toLowerCase()
            .replace(/\s/g, "")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")}`,
        title,
        type: "string",

    };
}
export default withDocument(CreateReferenceNumber)