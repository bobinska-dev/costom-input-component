import React, { useEffect, useState, useRef, useCallback } from "react";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import { withDocument } from 'part:@sanity/form-builder'
import styled from "styled-components";
import {
    Heading
} from '@sanity/ui'


const PreviewRef = (props) => {

    const { title, order, document } = props;

    const getDocs = (document) => {
        return client.fetch(
            `*[_type == "post" && references(${document._id})]` //
        )
            .then(data => console.log(data));
    }
    console.log(getDocs(), document._id)

    return (
        <>
            <Heading as={order} size={3} >
                {title}
            </Heading>
        </>
    );
}
export default withDocument(PreviewRef)