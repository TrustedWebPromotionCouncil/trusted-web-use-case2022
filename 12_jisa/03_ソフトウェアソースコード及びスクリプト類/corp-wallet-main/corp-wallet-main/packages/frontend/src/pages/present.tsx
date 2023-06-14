import { useRouter } from "next/router";
import React from "react";

import { PresentTemplate } from "../components/templates/Present";
import { RequireLogin } from "../components/utils/RequireLogin";
import { LOCAL_STORAGE_VC_REQUEST_KEY } from "../configs/constants";
import { VCRequest } from "../types";

const PresentPage: React.FC = () => {
  const [vcRequest, setVcRequest] = React.useState<VCRequest>();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const vcRequestString = localStorage.getItem(LOCAL_STORAGE_VC_REQUEST_KEY);
      if (!vcRequestString) {
        router.push({
          pathname: "/result",
          query: { type: "present", result: "false", errorMessage: "Get vcRequest Faild" },
        });
      }
      const vcRequest = JSON.parse(vcRequestString);
      setVcRequest(vcRequest);
    })();
  }, [router]);
  return (
    <RequireLogin>
      <PresentTemplate vcRequest={vcRequest} />
    </RequireLogin>
  );
};

export default PresentPage;
