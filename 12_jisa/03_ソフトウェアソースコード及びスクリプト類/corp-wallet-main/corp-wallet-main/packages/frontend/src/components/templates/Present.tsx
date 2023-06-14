import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";

import { VCRequest } from "../../types";
import { Body } from "../atoms/Body";
import { Header } from "../organisms/Header";
import { Present } from "../organisms/Present";

export interface PresentTemplateProps {
  vcRequest: VCRequest;
}

export const PresentTemplate: React.FC<PresentTemplateProps> = ({ vcRequest }) => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Header showHomeIcon={true} />
        <Flex justifyContent={"center"} p={4}>
          <Box bg={"white"} w={"800px"}>
            <Container maxW="md" py={{ base: "20" }}>
              <Present vcRequest={vcRequest} />
            </Container>
          </Box>
        </Flex>
      </Box>
    </Body>
  );
};
