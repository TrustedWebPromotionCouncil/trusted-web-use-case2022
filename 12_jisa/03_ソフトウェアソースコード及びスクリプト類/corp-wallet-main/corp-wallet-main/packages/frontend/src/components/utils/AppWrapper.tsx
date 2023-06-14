import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { theme as proTheme } from "@chakra-ui/pro-theme";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";

import { msalConfig } from "../../lib/auth/config";

export interface AppWrapperProps {
  children: React.ReactNode;
}

const theme = extendTheme(
  {
    colors: { ...proTheme.colors, brand: proTheme.colors.teal },
  },
  proTheme
);

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const pca = new PublicClientApplication(msalConfig);
  return (
    <ChakraProvider theme={theme}>
      <MsalProvider instance={pca}>{children}</MsalProvider>
    </ChakraProvider>
  );
};
