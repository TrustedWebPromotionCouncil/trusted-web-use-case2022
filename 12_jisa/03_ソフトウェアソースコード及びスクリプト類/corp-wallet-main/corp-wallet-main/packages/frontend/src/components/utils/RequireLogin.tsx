import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import React from "react";

import { LoginTemplate } from "../templates/Login";

export interface RequireLoginProps {
  children: React.ReactNode;
}

export const RequireLogin: React.FC<RequireLoginProps> = ({ children }) => {
  return (
    <>
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginTemplate />
      </UnauthenticatedTemplate>
    </>
  );
};
