import React, { FunctionComponent } from "react";

import { Header} from "@/shared/components"

import "./adidSetting.scss";

export interface AdidSettingViewProps {
  onBack: () => void;
}

export const AdidSettingView: FunctionComponent<AdidSettingViewProps> = (props) => {
  const { onBack } = props;
  return (
    <>
      <Header title={"広告識別子設定"} onBack={onBack} />
    </>
  );
};
