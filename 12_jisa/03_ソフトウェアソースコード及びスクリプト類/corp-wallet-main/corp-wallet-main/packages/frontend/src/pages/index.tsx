import React from "react";

import { HomeTemplate } from "../components/templates/Home";
import { RequireLogin } from "../components/utils/RequireLogin";

const IndexPage: React.FC = () => {
  return (
    <RequireLogin>
      <HomeTemplate />
    </RequireLogin>
  );
};

export default IndexPage;
