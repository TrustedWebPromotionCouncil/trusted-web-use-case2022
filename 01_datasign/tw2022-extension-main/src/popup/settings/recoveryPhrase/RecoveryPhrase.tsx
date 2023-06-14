import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { RecoveryPhraseView } from "./RecoveryPhrase.view";

export const RecoveryPhrase: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  return (
      <RecoveryPhraseView onBack={onBack} />
  );
};
