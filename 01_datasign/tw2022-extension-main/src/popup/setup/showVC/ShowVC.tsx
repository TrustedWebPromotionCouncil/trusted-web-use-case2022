import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { ShowVCView } from "./ShowVC.view";

export const ShowVC: FunctionComponent = () => {
  const navigate = useNavigate();

  const onNext = () => {
    navigate('/setup/adid-type-setting');
  };
  const onBack = () => {
    navigate(-1);
  };

  return (
      <ShowVCView onNext={onNext} onBack={onBack}/>
  );
};
