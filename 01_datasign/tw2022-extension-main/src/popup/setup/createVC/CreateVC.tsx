import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { CreateVCView } from "./CreateVC.view";

export const CreateVC: FunctionComponent = () => {
  const navigate = useNavigate();

  const onNext = () => {
    navigate('/setup/show-vc');
  };
  const onBack = () => {
    navigate(-1);
  };

  return (
      <CreateVCView onNext={onNext} onBack={onBack}/>
  );
};
