import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { BunsinSettingView } from "./BunsinSetting.view";

export const BunsinSetting: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  return (
      <BunsinSettingView onBack={onBack} />
  );
};
