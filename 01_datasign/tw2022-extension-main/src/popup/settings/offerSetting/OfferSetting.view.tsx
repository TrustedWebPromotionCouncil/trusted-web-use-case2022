import React, { FunctionComponent } from "react";

import { Header} from "@/shared/components"

import "./offerSetting.scss";

export interface OfferSettingViewProps {
  onBack: () => void;
}

export const OfferSettingView: FunctionComponent<OfferSettingViewProps> = (props) => {
  const { onBack } = props;
  return (
    <>
      <Header title={"検証OK時の提供設定"} onBack={onBack} />
    </>
  );
};
