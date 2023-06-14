import React, { FunctionComponent } from "react";

import { Header} from "@/shared/components"

import "./recoveryPhrase.scss";

export interface RecoveryPhraseViewProps {
  onBack: () => void;
}

export const RecoveryPhraseView: FunctionComponent<RecoveryPhraseViewProps> = (props) => {
  const { onBack } = props;
  return (
    <>
      <Header title={"リカバリーフレーズ表示"} onBack={onBack} />
    </>
  );
};
