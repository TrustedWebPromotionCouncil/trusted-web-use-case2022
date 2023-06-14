import React, { FunctionComponent } from "react";

import { Header} from "@/shared/components"

import "./bunsinSetting.scss";

export interface BunsinSettingViewProps {
  onBack: () => void;
}

export const BunsinSettingView: FunctionComponent<BunsinSettingViewProps> = (props) => {
  const { onBack } = props;
  return (
    <>
      <Header title={"Bunsin連携"} onBack={onBack} />
    </>
  );
};
