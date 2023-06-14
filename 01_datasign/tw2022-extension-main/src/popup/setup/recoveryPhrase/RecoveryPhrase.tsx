import React, {FunctionComponent, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import { RecoveryPhraseView } from "./RecoveryPhrase.view";
// import {useStoreContext} from "@/Context";
// import {SingleHDKeyRingController} from "@/keyRing/SingleHDKeyRingController";

export const RecoveryPhrase: FunctionComponent = () => {
  const navigate = useNavigate();
  const onNext = () => {
    navigate('/setup/dwn-setting', );
  };
  const onBack = () => {
    navigate(-1);
  };
  // const [recoveryPhrase, setRecoveryPhrase] = useState("");
  // const { state } = useStoreContext();
  // const { encryptedVault, password } = state;

  // const onClickNext = async () => {
  //   onNext();
  // };

  // useEffect(() => {
  //   if (encryptedVault && password) {
  //     (async () => {
  //       const initState = { vault: encryptedVault };
  //       const keyRingController = new SingleHDKeyRingController({ initState });
  //       await keyRingController.unlock(password!);
  //       const seedPhrase = await keyRingController.getSeedPhrase();
  //       setRecoveryPhrase(seedPhrase);
  //     })();
  //   }
  // }, [encryptedVault, password]);

  return (
      <RecoveryPhraseView onNext={onNext} onBack={onBack}/>
  );
};
