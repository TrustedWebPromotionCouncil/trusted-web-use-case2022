import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AccessLogView } from "@/popup/accessLog/AccessLog.view";
import { useStoreContext } from "@/Context";
import { getProvidedHistories } from "@/utils/dataStore";

export const AccessLog: FunctionComponent = (props) => {
  const [urlMap, setUrlMap] = useState({});
  const { state, dispatch } = useStoreContext();
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };
  const { accessLog, processing } = state;
  useEffect(() => {
    (async () => {
      const providedHistories = await getProvidedHistories();
      const mp: { [key: string]: string } = {};
      for (const h of providedHistories.histories) {
        const { thirdParties, ...rest } = h;
        const { did, url } = rest;
        mp[did] = url;
        for (const subH of thirdParties) {
          const { did, domain } = subH;
          mp[did] = domain;
        }
      }
      setUrlMap(mp);
      dispatch({ type: "setProcessing", payload: { processing: true } });
      await chrome.runtime.sendMessage({
        data: {
          type: "getAccessLog",
        },
      });
    })();
  }, []);
  return (
    <AccessLogView
      accessLogs={accessLog}
      onBack={onBack}
      urlMap={urlMap}
      loading={processing}
    />
  );
};
