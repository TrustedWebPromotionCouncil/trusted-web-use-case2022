import { useRouter } from "next/router";
import React from "react";

import { ResultTemplate } from "../components/templates/Result";
import { RequireLogin } from "../components/utils/RequireLogin";

const ResultPage: React.FC = () => {
  const router = useRouter();
  return (
    <RequireLogin>
      <ResultTemplate
        type={router.query.type as "issue" | "present"}
        result={router.query.result === "true" ? true : false}
        errorMessage={router.query.errorMessage as string | undefined}
        issuedCredentialID={router.query.issuedCredentialID as string | undefined}
        presentedCredentialIDs={router.query.presentedCredentialIDs as string[] | undefined}
        nextPath={router.query.nextPath as string | undefined}
      />
    </RequireLogin>
  );
};

export default ResultPage;
