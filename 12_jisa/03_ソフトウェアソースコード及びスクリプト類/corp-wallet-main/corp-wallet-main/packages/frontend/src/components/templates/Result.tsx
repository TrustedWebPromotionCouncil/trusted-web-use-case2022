import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";

import { Body } from "../atoms/Body";
import { Header } from "../organisms/Header";
import { Result } from "../organisms/Result";

export interface ResultTemplateProps {
  type: "issue" | "present" | "loading";
  result: boolean;
  errorMessage: string | undefined;
  issuedCredentialID?: string;
  presentedCredentialIDs?: string[];
  nextPath?: string;
}

export const ResultTemplate: React.FC<ResultTemplateProps> = ({
  type,
  result,
  errorMessage,
  nextPath,
  issuedCredentialID,
  presentedCredentialIDs,
}) => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Header />
        <Flex justifyContent={"center"} p={4}>
          <Box bg={"white"} w={"800px"}>
            <Container maxW="md" py={{ base: "20" }}>
              <Result
                type={type}
                result={result}
                errorMessage={errorMessage}
                nextPath={nextPath}
                issuedCredentialID={issuedCredentialID}
                presentedCredentialIDs={presentedCredentialIDs}
              />
            </Container>
          </Box>
        </Flex>
      </Box>
    </Body>
  );
};
