import { Box, Flex } from "@chakra-ui/react";
import React from "react";

import { Body } from "../atoms/Body";
import { SideNavigation } from "../molecules/SideNavigation";
import { Header } from "../organisms/Header";
import { TransactionList } from "../organisms/TransactionList";

export const TransactionListTemplate: React.FC = () => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Header />
        <Flex justifyContent={"center"} p={4}>
          <SideNavigation />
          <Box bg={"white"} w={"800px"}>
            <TransactionList />
          </Box>
        </Flex>
      </Box>
    </Body>
  );
};
