import { Box } from "@chakra-ui/react";
import React from "react";

import { Body } from "../atoms/Body";
import { Login } from "../organisms/Login";

export const LoginTemplate: React.FC = () => {
  return (
    <Body>
      <Box bg="#f8f7f6" minH={"100vh"}>
        <Login />
      </Box>
    </Body>
  );
};
