import React, { FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DwnSettingView } from "./DwnSetting.view";
import { saveAccountState } from "../../../utils/dataStore";
import { SingleHDKeyRingController } from "../../../keyRing/SingleHDKeyRingController";
import ion from "../../../did/ion";
import { useStoreContext } from "../../../Context";

export const DwnSetting: FunctionComponent = () => {
  const { state, dispatch } = useStoreContext();

  const { password, encryptedVault, dwnSetting } = state;

  const navigate = useNavigate();
  const onNext = () => {
    navigate("/setup/master-did");
  };
  const onBack = () => {
    navigate(-1);
  };

  const onClickNext = async (dwnLocation: string, dwnLocationURL: string) => {
    const location =
      dwnLocation === "data-sign" ? "https://dwn.datasign.jp" : dwnLocationURL;
    const _dwnSetting = {
      defaultLocation: dwnLocation === "data-sign",
      location,
    };
    await saveAccountState({ dwnSetting: _dwnSetting });
    dispatch({
      type: "updateDwnSetting",
      payload: { dwnSetting: _dwnSetting },
    });

    if (!dwnSetting || dwnSetting.location !== location) {
      // get private key
      const initState = { vault: encryptedVault };
      const keyRingController = new SingleHDKeyRingController({ initState });
      await keyRingController.unlock(password!);
      const addresses = await keyRingController.getAccounts();
      const privateKey = await keyRingController.getPrivateKey(addresses[0]);

      // issue new did
      console.debug("issue master did");
      const didState = await ion.issueDID(privateKey, location);
      console.debug({ didState });
      await saveAccountState({ didState });
      dispatch({
        type: "setMasterDIDState",
        payload: { didState },
      });
    }
    onNext();
  };

  const dwnLocation = dwnSetting?.defaultLocation ? "data-sign" : "custom";
  const dwnLocationURL = !dwnSetting?.defaultLocation
    ? dwnSetting?.location || ""
    : "";
  return (
    <DwnSettingView
      dwnLocation={dwnLocation}
      dwnLocationURL={dwnLocationURL}
      onSubmit={onClickNext}
      onBack={onBack}
    />
  );
};
