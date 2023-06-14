import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ds from "@/utils/dataStore";
import { useStoreContext } from "../../../Context";

import { AdidTypeSettingView } from "./AdidTypeSetting.view";

export const AdidTypeSetting: FunctionComponent = () => {
  const navigate = useNavigate();
  const onNext = () => {
    navigate("/setup/adid-usage-setting");
  };
  const onBack = () => {
    navigate(-1);
  };
  const { state, dispatch } = useStoreContext();
  const [adIdSetting, setAdIdSetting] =
    useState<"global" | "by_1st_party" | undefined>(undefined);

  const onClickNext = async (adIdSetting: "global" | "by_1st_party") => {
    // don't store on storage until ad usage setting is selected
    // await saveAccountState({ adIdSetting: _setting });
    dispatch({
      type: "updateAdIdSettingScope",
      payload: { scope: adIdSetting },
    });
    ds.syncToDwn("AccountState");
    onNext();
  };

  const { scope } = state;
  useEffect(() => {
    if (scope) {
      setAdIdSetting(scope);
    }
  }, [scope]);

  return (
    <AdidTypeSettingView
      adIdOfferType={adIdSetting}
      onSubmit={onClickNext}
      onBack={onBack}
    />
  );
};
