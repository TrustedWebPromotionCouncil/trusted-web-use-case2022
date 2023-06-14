import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { AdidSettingView } from "./AdidSetting.view";

export const AdidSetting: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  return (
      <AdidSettingView onBack={onBack} />
  );
};
