import React, { useEffect, useState, useRef, useCallback } from "react";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import { withRouterHOC } from "@sanity/base/router";
import DocumentListItem from "./DocumentListItem";
import DocumentList from "./DocumentList";
import DocumentView from "./DocumentView";
import styled from "styled-components";
import { Flex } from "@sanity/ui";

const ToolRoot = styled(Flex)`
  height: 100%;
  width: 100%;
`;

function getDocumentTypeNames() {
  return schema
    .getTypeNames()
    .map((typeName) => schema.get(typeName))
    .filter((type) => type.type && type.type.name === "document")
    .map((type) => type.name);
}

function MyTool(props) {
  const { router } = props;
  const documentListRef = useRef(null);
  const documentFetchRef = useRef(null);
  const [documents, setDocuments] = useState(null);
  const [currentDocument, setCurrentDocument] = useState();
  const [currentDocumentId, setCurrentDocumentId] = useState(null);

  const handleReceiveList = useCallback((documents) => {
    setDocuments(documents);
  }, []);

  const handleReceiveDocument = useCallback((document) => {
    setCurrentDocument(document);
  }, []);

  const fetchDocument = useCallback((documentId) => {
    // If we're already fetching a document, make sure to cancel that request
    if (documentFetchRef.current) {
      documentFetchRef.current.unsubscribe();
    }

    if (!documentId) {
      handleReceiveDocument(undefined)
      
      return;
    }

    documentFetchRef.current = client.observable
      .getDocument(documentId)
      .subscribe(handleReceiveDocument);
  }, []);

  useEffect(() => {
    // Fetch 50 last updated, published documents
    documentListRef.current = client.observable
      .fetch(
        '*[!(_id in path("drafts.**")) && _type in $types][0...50] | order (_updatedAt desc)',
        { types: getDocumentTypeNames() }
      )
      .subscribe(handleReceiveList);

    return () => {
      // When unmounting, cancel any ongoing requests
      if (documentListRef.current) {
        documentListRef.current.unsubscribe();
      }

      if (documentFetchRef.current) {
        documentFetchRef.current.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    // If we have a document ID as part of our route, load that document as well
    setCurrentDocumentId(router.state.selectedDocumentId);
    fetchDocument(router.state.selectedDocumentId);
  }, [router.state.selectedDocumentId]);

  return (
    <ToolRoot>
      <DocumentList>
        {documents &&
          documents.map((doc) => (
            <DocumentListItem
              key={doc._id}
              document={doc}
              schemaType={schema.get(doc._type)}
              selected={currentDocumentId === doc._id}
            />
          ))}
      </DocumentList>
      <DocumentView document={currentDocument} />
    </ToolRoot>
  );
}

export default withRouterHOC(MyTool);
