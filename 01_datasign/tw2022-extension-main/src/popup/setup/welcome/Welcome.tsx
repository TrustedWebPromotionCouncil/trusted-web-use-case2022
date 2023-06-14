import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { WelcomeView } from "./Welcome.view";

export const Welcome: FunctionComponent = () => {
  const navigate = useNavigate();

  const onNext = () => {
    navigate('/setup/input-password');
  };
  const onBack = () => {
    navigate(-1);
  };

  return (
      <WelcomeView onNext={onNext} onBack={onBack} />
  );
};
