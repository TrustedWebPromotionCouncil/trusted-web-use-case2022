import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { useStoreContext } from "../../../Context";
import { MasterDIDView } from "./MasterDID.view";

export const MasterDID: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state } = useStoreContext();
  const onNext = () => {
    navigate("/setup/adid-type-setting");
  };
  const onBack = () => {
    navigate(-1);
  };

  return (
    <MasterDIDView
      masterDID={state.didState?.longForm || ""}
      onNext={onNext}
      onBack={onBack}
    />
  );
};
