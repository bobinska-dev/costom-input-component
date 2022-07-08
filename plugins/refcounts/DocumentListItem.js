import React, { useEffect, useState, useCallback } from "react";
import { SanityPreview } from "@sanity/base/preview";
import { StateLink } from "@sanity/base/router";
import { Card, Box } from "@sanity/ui";

function areEqual(prevProps, nextProps) {
  const { pressed } = prevProps;
  const { pressed: nextPressed } = nextProps;

  return pressed !== nextPressed;
}

export default React.memo(function DocumentListItem({
  document,
  selected,
  schemaType,
}) {
  const documentId = document._id;
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => setClicked(true), []);

  // Reset `clicked` state when `selected` prop changes
  useEffect(() => setClicked(false), [selected]);

  return (
    <Box paddingX={2} as="li">
      <Card
        __unstable_focusRing
        as={StateLink}
        state={{ selectedDocumentId: documentId }}
        data-as="a"
        data-ui="PaneItem"
        padding={2}
        radius={2}
        selected={clicked || selected}
        onClick={handleClick}
      >
        <SanityPreview layout="default" value={document} type={schemaType} />
      </Card>
    </Box>
  );
},
areEqual);
