import React, { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReInputPasswordView } from "./ReInputPassword.view";
import { SingleHDKeyRingController } from "../../keyRing/SingleHDKeyRingController";
import { useStoreContext } from "../../Context";
import { setPassword as setPassword2 } from "../../utils/dataStore";

export const ReInputPassword: FunctionComponent = () => {
  const navigate = useNavigate();
  const onNext = () => {
    navigate("/menu");
  };
  const onBack = () => {
    navigate(-1);
  };
  const { state, dispatch } = useStoreContext();
  const [error, setError] = useState("");

  const onClickNextFromInputPassword = async (password: string) => {
    const initState = { vault: state.encryptedVault };
    console.log({ password, initState });
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(password);
    if (keyRingController.isUnlocked) {
      await setPassword2(password);
      dispatch({ type: "setPassword", payload: { password } });
      onNext();
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <ReInputPasswordView
      error={error}
      onSubmit={onClickNextFromInputPassword}
      onBack={onBack}
    />
  );
};
