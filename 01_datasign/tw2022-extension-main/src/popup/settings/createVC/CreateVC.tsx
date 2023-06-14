import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { CreateVCView } from "./CreateVC.view";

export const CreateVC: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  return (
      <CreateVCView onBack={onBack} />
  );
};
