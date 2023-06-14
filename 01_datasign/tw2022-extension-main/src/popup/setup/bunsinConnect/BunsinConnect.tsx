import React, { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BunsinConnectView } from "./BunsinConnect.view";
import { ErrorMessage } from "@/shared/types";

import * as ap from "./asyncProcess";
import { ASYNC_STORAGE_KEY_EMAIL, setLocalStorage } from "@/utils/dataStore";

export const BunsinConnect: FunctionComponent = () => {
  const [error, setError] = useState<ErrorMessage>({ title: "" });
  const navigate = useNavigate();
  const onNext = () => {
    navigate("/setup/bunsin-connect-confirm");
  };
  const onBack = () => {
    navigate(-1);
  };

  const requestSignIn = async (email: string) => {
    console.log("start sign in");
    const result = await ap.requestSignIn(email);
    if (result.type === "no_content") {
      await setLocalStorage(ASYNC_STORAGE_KEY_EMAIL, email);
      onNext();
    } else {
      if (result.type === "client_error") {
        const title = `error.${result.clientErrorInfo.message}.title`;
        const subTitle = `error.${result.clientErrorInfo.message}.message`;
        setError({ title, subTitle });
      } else {
        throw result.sourceError;
      }
    }
  };

  return <BunsinConnectView onSubmit={requestSignIn} onBack={onBack} />;
};
