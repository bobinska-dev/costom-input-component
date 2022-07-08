import React from "react";
import { IntentLink } from "@sanity/base/router";
import { Card, Code, Stack, Heading } from "@sanity/ui";

export default function DocumentView({ document }) {
  return (
    <Card overflow="auto" padding={4} flex={1}>
      {document && (
        <Stack space={4}>
          <Heading as="h2">
            {document._id} -{" "}
            <IntentLink
              intent="edit"
              params={{ id: document._id, type: document._type }}
            >
              Edit
            </IntentLink>
          </Heading>

          <Code>{JSON.stringify(document, null, 2)}</Code>
        </Stack>
      )}
    </Card>
  );
}
