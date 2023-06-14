import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getVerifiedContextAll } from "../../../utils/dataStore";
import { VerifyResultCurrentView } from "./VerifyResultCurrent.view";
import { VerifiedFirstParty } from "../../../../bundles/src/types";

export const VerifyResultCurrent: FunctionComponent = (props) => {
  const [history, setHistory] = useState<VerifiedFirstParty>();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const _history = await getVerifiedContextAll();
      if (state && state.id) {
        for (const h of Object.keys(_history)) {
          const v = _history[h];
          if (v.id === state.id) {
            setHistory(v);
            break;
          }
        }
      } else {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        const url = 0 < tabs.length ? tabs[0].url : "";
        for (const h of Object.keys(_history)) {
          const v = _history[h];
          if (v.url === url) {
            setHistory(v);
            break;
          }
        }
      }
    })();
  }, []);
  const onBack = () => {
    navigate(-1);
  };
  return <VerifyResultCurrentView result={history} onBack={onBack} />;
};
