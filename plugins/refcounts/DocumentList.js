import React from "react";
import styled from "styled-components";
import { Card, Flex, Box, Spinner, Text, Stack } from "@sanity/ui";

const DocumentListContainer = styled(Card)`
  width: 100%;
  min-width: 220px;
  max-width: 350px;
  height: 100%;
  padding: 0;
  margin: 0;
  border-right: 1px solid var(--card-border-color);
`;

export default function DocumentList({ children }) {
  if (!children) {
    return (
      <DocumentListContainer display="flex" padding={4} overflow="auto" as="ul">
        <Card flex={1} padding={4}>
          <Flex direction="column" justify="center" align="center">
            <Spinner muted />
            <Box marginTop={3}>
              <Text muted>Loading documents…</Text>
            </Box>
          </Flex>
        </Card>
      </DocumentListContainer>
    );
  }

  return (
    <DocumentListContainer display="flex" tone="default" padding={0} paddingTop={1}>
      <Card paddingY={2} flex={1} overflow="auto" as="ul">
        <Stack space={1}>
            {children}
        </Stack>
      </Card>
    </DocumentListContainer>
  );
}
