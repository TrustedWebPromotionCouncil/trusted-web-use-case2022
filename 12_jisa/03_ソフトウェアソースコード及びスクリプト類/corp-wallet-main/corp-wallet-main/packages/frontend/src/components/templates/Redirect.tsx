import { Box } from "@chakra-ui/react";
import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Header } from "../organisms/Header";
import { Redirect } from "../organisms/Redirect";

export const RedirectTemplate: React.FC = () => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Header />
        <Container py="8">
          <Redirect />
        </Container>
      </Box>
    </Body>
  );
};
