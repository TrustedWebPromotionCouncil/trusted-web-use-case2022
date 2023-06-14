import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { DwnSettingView } from "./DwnSetting.view";

export const DwnSetting: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  return (
      <DwnSettingView onBack={onBack} />
  );
};
