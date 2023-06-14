import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";

import { AcquiredIdToken, Manifest, VCRequest } from "../../types";
import { Body } from "../atoms/Body";
import { Header } from "../organisms/Header";
import { Issue } from "../organisms/Issue";

export interface IssueTemplateProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredIdToken;
}

export const IssueTemplate: React.FC<IssueTemplateProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Header />
        <Flex justifyContent={"center"} p={4}>
          <Box bg={"white"} w={"800px"}>
            <Container maxW="md" py={{ base: "20" }}>
              <Issue vcRequest={vcRequest} manifest={manifest} acquiredAttestation={acquiredAttestation} />
            </Container>
          </Box>
        </Flex>
      </Box>
    </Body>
  );
};
