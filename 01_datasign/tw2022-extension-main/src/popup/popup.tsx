import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Route,
  Link,
  MemoryRouter,
  Routes,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Menu } from "@/popup/menu/Menu";
import { VerifyResultCurrent } from "@/popup/verifyResult/verifyResultCurrent/VerifyResultCurrent";
import { VerifyResultList } from "@/popup/verifyResult/verifyResultList/VerifyResultList";
import { VCList } from "@/popup/vcList/VCList";
import { BunsinSetting } from "@/popup/settings/bunsinSetting/BunsinSetting";
import { AdidSetting } from "@/popup/settings/adidSetting/AdidSetting";
// import { RecoveryPhrase } from "@/popup/settings/recoveryPhrase/RecoveryPhrase";
import { OfferSetting } from "@/popup/settings/offerSetting/OfferSetting";
// import { CreateVC } from "@/popup/settings/createVC/CreateVC";
// import { DwnSetting } from "@/popup/settings/dwnSetting/DwnSetting";
import ErrorPage from "./ErrorPage";

import { Welcome } from "@/popup/setup/welcome/Welcome";
import { InputPassword } from "@/popup/setup/inputPassword/InputPassword";
import { RecoveryPhrase } from "@/popup/setup/recoveryPhrase/RecoveryPhrase";
import { DwnSetting } from "@/popup/setup/dwnSetting/DwnSetting";
import { MasterDID } from "@/popup/setup/masterDID/MasterDID";
import { CreateVC } from "@/popup/setup/createVC/CreateVC";
import { ShowVC } from "@/popup/setup/showVC/ShowVC";
import { AdidTypeSetting } from "@/popup/setup/adidTypeSetting/AdidTypeSetting";
import { AdidUsageSetting } from "@/popup/setup/adidUsageSetting/AdidUsageSetting";
import { BunsinConnect } from "@/popup/setup/bunsinConnect/BunsinConnect";
import { BunsinConnectConfirm } from "@/popup/setup/bunsinConnectConfirm/BunsinConnectConfirm";
import { SetupDone } from "@/popup/setup/setupDone/SetupDone";
import { ReInputPassword } from "@/popup/reInputPassword/ReInputPassword";
import { AccessLog } from "@/popup/accessLog/AccessLog";

import { reducer, initialState, AccountState } from "../store";
import context, { KeyRingContext } from "../Context";
import { SingleHDKeyRingController } from "../keyRing/SingleHDKeyRingController";

import { useStoreContext } from "../Context";

import {
  getAccountStatus,
  getPassword,
  getLocalStorage,
  ASYNC_STORAGE_KEY_EMAIL,
} from "../utils/dataStore";

import "./styles.scss";

const Layout: FunctionComponent = () => {
  const { state, dispatch } = useStoreContext();
  const navigate = useNavigate();
  const { adIdSetting } = state;

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        if (message.data) {
          console.log({ message });
          const { type } = message.data;
          if (type === "setAccessLog") {
            const { accessLog } = message.data;
            dispatch({
              type: "setAccessLog",
              payload: {
                accessLog,
              },
            });
            dispatch({ type: "setProcessing", payload: { processing: false } });
          }
        }
      }
    );
    (async () => {
      const response = await getAccountStatus();
      const bunsinSignIn = await getLocalStorage(ASYNC_STORAGE_KEY_EMAIL);
      if (bunsinSignIn) {
        navigate("/setup/bunsin-connect-confirm");
      }
      if (response.encryptedVault) {
        const password = await getPassword();
        const { encryptedVault } = response;
        console.debug("restore keyring from encrypted vault");
        dispatch({
          type: "setVault",
          payload: {
            encryptedVault,
            password,
          },
        });
      }
      if (response.didState) {
        console.debug("restore did status", response.didState);
        dispatch({
          type: "setMasterDIDState",
          payload: { didState: response.didState },
        });
      }
      if (response.dwnSetting) {
        const { dwnSetting } = response as AccountState;
        console.debug("restore dwn setting", dwnSetting);
        dispatch({
          type: "updateDwnSetting",
          payload: { dwnSetting: dwnSetting! },
        });
      }
      if (response.adIdSetting) {
        console.debug("restore ad-id setting", response.adIdSetting);
        dispatch({
          type: "updateAdIdSetting",
          payload: { adIdSetting: response.adIdSetting },
        });
        navigate("menu");
      } else {
        navigate("setup");
      }
    })();
  }, []);
  return (
    <>
      <div className="popup-container">
        <Outlet />
      </div>
    </>
  );
};

const PopUpRouter: FunctionComponent = () => (
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="setup">
          <Route index element={<Welcome />} />
          <Route path="input-password" element={<InputPassword />} />
          <Route path="recovery-phrase" element={<RecoveryPhrase />} />
          <Route path="dwn-setting" element={<DwnSetting />} />
          <Route path="master-did" element={<MasterDID />} />
          <Route path="create-vc" element={<CreateVC />} />
          <Route path="show-vc" element={<ShowVC />} />
          <Route path="adid-type-setting" element={<AdidTypeSetting />} />
          <Route path="adid-usage-setting" element={<AdidUsageSetting />} />
          <Route path="bunsin-connect" element={<BunsinConnect />} />
          <Route
            path="bunsin-connect-confirm"
            element={<BunsinConnectConfirm />}
          />
          <Route path="setup-done" element={<SetupDone />} />
        </Route>
        {/* verifyResult */}
        <Route path="verifyResultCurrent" element={<VerifyResultCurrent />} />
        <Route path="verifyResultList" element={<VerifyResultList />} />
        {/* vcList */}
        <Route path="vcListNonBot" element={<VCList />} />
        <Route path="vcListAdId" element={<VCList />} />
        <Route path="vcListEmail" element={<VCList />} />
        <Route path="accessLog" element={<AccessLog />} />
        <Route path="menu">
          <Route index element={<Menu />} />
          {/* settings */}
          <Route path="bunsinSetting" element={<BunsinSetting />} />
          <Route path="adidSetting" element={<AdidSetting />} />
          <Route path="recoveryPhrase" element={<RecoveryPhrase />} />
          <Route path="offerSetting" element={<OfferSetting />} />
          <Route path="createVC" element={<CreateVC />} />
          <Route path="dwnSetting" element={<DwnSetting />} />
          <Route path="reInputPassword" element={<ReInputPassword />} />
        </Route>
      </Route>
    </Routes>
  </MemoryRouter>
);
const Popup: React.VFC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [keyRingContextValue, setKeyRingContextValue] =
    useState<KeyRingContext>({});

  const defaultStoreValue = { state, dispatch };
  const StoreContext = context.getStoreContext(defaultStoreValue);
  const KeyRingContext = context.getKeyRingContext(keyRingContextValue);
  const { encryptedVault } = state;
  useEffect(() => {
    if (encryptedVault) {
      // encryptedVaultはboot処理をどこか別のところで実行して、ローカルストレージから取得した値を使う想定
      const keyRingController = new SingleHDKeyRingController({
        initState: { vault: encryptedVault },
      });
      setKeyRingContextValue({ keyRingController });
    }
  }, [encryptedVault]);
  return (
    <StoreContext.Provider value={defaultStoreValue}>
      <KeyRingContext.Provider value={keyRingContextValue}>
        <PopUpRouter />
      </KeyRingContext.Provider>
    </StoreContext.Provider>
  );
};

export default Popup;
