import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { SetupDoneView } from "./SetupDone.view";

export const SetupDone: FunctionComponent = () => {
  const navigate = useNavigate();
  const onNext = () => {
    navigate('/');
  };
  const onBack = () => {
    navigate(-1);
  };

  return (
      <SetupDoneView onNext={onNext} onBack={onBack}/>
  );
};
