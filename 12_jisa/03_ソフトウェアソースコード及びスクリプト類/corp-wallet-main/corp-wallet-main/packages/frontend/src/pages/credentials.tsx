import React from "react";

import { CredentialsTemplate } from "../components/templates/Credentials";
import { RequireLogin } from "../components/utils/RequireLogin";

const CredentialDetailPage: React.FC = () => {
  return (
    <RequireLogin>
      <CredentialsTemplate />
    </RequireLogin>
  );
};

export default CredentialDetailPage;
