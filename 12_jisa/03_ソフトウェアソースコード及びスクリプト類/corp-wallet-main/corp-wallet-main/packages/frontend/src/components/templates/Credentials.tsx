import { Box, Flex } from "@chakra-ui/react";
import React from "react";

import { Body } from "../atoms/Body";
import { SideNavigation } from "../molecules/SideNavigation";
import { Credentials } from "../organisms/Credentials";
import { Header } from "../organisms/Header";

export const CredentialsTemplate: React.FC = () => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Header />
        <Flex justifyContent={"center"} p={4}>
          <SideNavigation />
          <Box bg={"white"} w={"800px"}>
            <Credentials />
          </Box>
        </Flex>
      </Box>
    </Body>
  );
};
