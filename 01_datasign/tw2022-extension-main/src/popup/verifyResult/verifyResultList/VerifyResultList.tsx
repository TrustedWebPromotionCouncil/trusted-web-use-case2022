import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getVerifiedContextAll } from "../../../utils/dataStore";

import { VerifyResultListView } from "./VerifyResultList.view";
import { VerifiedFirstParty } from "../../../../bundles/src/types";

export const VerifyResultList: FunctionComponent = () => {
  const [history, setHistory] = useState<VerifiedFirstParty[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const _history = await getVerifiedContextAll();
      const arr = [];
      for (const h of Object.keys(_history)) {
        const v = _history[h];
        arr.push(v);
      }
      setHistory(arr);
    })();
  }, []);

  const onClick = (id: string) => {
    navigate("/verifyResultCurrent", { state: { id } });
  };
  const onBack = () => {
    navigate(-1);
  };
  return (
    <VerifyResultListView results={history} onClick={onClick} onBack={onBack} />
  );
};
