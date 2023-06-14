import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { saveAccountState } from "../../../utils/dataStore";
import { useStoreContext } from "../../../Context";

import { AdidUsageSettingView } from "./AdidUsageSetting.view";
import { AdUsage } from "@/store/types";

export const AdidUsageSetting: FunctionComponent = () => {
  const navigate = useNavigate();
  const onNext = () => {
    navigate("/setup/bunsin-connect");
  };
  const onBack = () => {
    navigate(-1);
  };

  const { state, dispatch } = useStoreContext();
  const [adIdUsage, setAdIdUsage] = useState<AdUsage[]>([]);

  const onClickNext = async (adIdUsage: AdUsage[]) => {
    const { scope } = state;
    await saveAccountState({
      adIdSetting: { scope: scope!, usage: adIdUsage },
    });
    dispatch({
      type: "updateAdIdSettingUsage",
      payload: { usage: adIdUsage },
    });
    onNext();
  };

  const { usage } = state;
  useEffect(() => {
    if (usage) {
      setAdIdUsage(usage);
    }
  }, [usage]);

  return (
    <AdidUsageSettingView
      adIdUsage={adIdUsage}
      onSubmit={onClickNext}
      onBack={onBack}
    />
  );
};
