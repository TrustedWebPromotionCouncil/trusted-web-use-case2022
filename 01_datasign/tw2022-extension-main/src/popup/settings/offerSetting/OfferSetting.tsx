import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { OfferSettingView } from "./OfferSetting.view";

export const OfferSetting: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  return (
      <OfferSettingView onBack={onBack} />
  );
};
