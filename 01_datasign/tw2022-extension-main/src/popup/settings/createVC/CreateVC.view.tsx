import React, { FunctionComponent } from "react";

import { Header} from "@/shared/components"

import "./createVC.scss";

export interface CreateVCViewProps {
  onBack: () => void;
}

export const CreateVCView: FunctionComponent<CreateVCViewProps> = (props) => {
  const { onBack } = props;
  return (
    <>
      <Header title={"非ボットVC作成"} onBack={onBack} />
    </>
  );
};
