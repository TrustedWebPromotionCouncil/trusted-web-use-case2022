import React, { FunctionComponent } from "react";

import { Header} from "@/shared/components"

import "./dwnSetting.scss";

export interface DwnSettingViewProps {
  onBack: () => void;
}

export const DwnSettingView: FunctionComponent<DwnSettingViewProps> = (props) => {
  const { onBack } = props;
  return (
    <>
      <Header title={"DWN設定"} onBack={onBack} />
    </>
  );
};
