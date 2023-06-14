import React, { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputPasswordView } from "./InputPassword.view";
import { SingleHDKeyRingController } from "../../../keyRing/SingleHDKeyRingController";
import { useStoreContext } from "../../../Context";
import {
  setPassword as setPassword2,
  saveAccountState,
} from "../../../utils/dataStore";

export const InputPassword: FunctionComponent = () => {
  const navigate = useNavigate();
  const onNext = () => {
    navigate("/setup/recovery-phrase");
  };
  const onBack = () => {
    navigate(-1);
  };
  const { dispatch } = useStoreContext();
  const [password, setPassword] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onClickNextFromInputPassword = async (password: string) => {
    const keyRingController = new SingleHDKeyRingController();
    console.debug("createNewVault");
    await keyRingController.createNewVault(password);
    const encryptedVault = keyRingController.encryptedVault;

    await setPassword2(password);
    await saveAccountState({ encryptedVault, password });
    dispatch({
      type: "initKeyRingDone",
      payload: { encryptedVault, password },
    });
    onNext();
  };

  return (
    <InputPasswordView
      onSubmit={onClickNextFromInputPassword}
      onBack={onBack}
    />
  );
};
