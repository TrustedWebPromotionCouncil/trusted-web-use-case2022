import React from "react";

import { RedirectTemplate } from "../components/templates/Redirect";
import { RequireLogin } from "../components/utils/RequireLogin";
const RedirectPage: React.FC = () => {
  return (
    <RequireLogin>
      <RedirectTemplate />
    </RequireLogin>
  );
};

export default RedirectPage;
