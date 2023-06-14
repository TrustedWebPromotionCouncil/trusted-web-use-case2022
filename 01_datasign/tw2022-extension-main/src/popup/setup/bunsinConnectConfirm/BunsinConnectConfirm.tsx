import React, { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BunsinConnectConfirmView } from "./BunsinConnectConfirm.view";
import {
  ASYNC_STORAGE_KEY_EMAIL,
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/dataStore";
import * as ap from "./asyncProcess";

export const BunsinConnectConfirm: FunctionComponent = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  const requestSignInConfirm = async (code: string) => {
    console.log("start sign in");

    const bunsinSignInEmail = await getLocalStorage(ASYNC_STORAGE_KEY_EMAIL);
    const result = await ap.requestSignInConfirm(
      bunsinSignInEmail,
      code,
      false
    );
    if (result.type === "ok") {
      await removeLocalStorage("email");
      navigate("/setup/setup-done");
    } else {
      if (result.type === "client_error") {
        setError(`error.${result.clientErrorInfo.message}.message`);
      } else {
        throw result.sourceError;
      }
    }
  };

  return (
    <BunsinConnectConfirmView onSubmit={requestSignInConfirm} onBack={onBack} />
  );
};
