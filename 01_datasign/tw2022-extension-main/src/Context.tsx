import React, { Context, Dispatch, useContext } from "react";

import { Action, StoreState } from "./store";
import { SingleHDKeyRingController } from "./keyRing/SingleHDKeyRingController";

// ------------ store context ---------------------
interface StoreContext {
  state: StoreState;
  dispatch: Dispatch<Action>;
}

let storeContext: Context<StoreContext> | null = null;

const getStoreContext = (defaultValue?: StoreContext) => {
  if (!storeContext && defaultValue) {
    storeContext = React.createContext(defaultValue);
  }
  return storeContext as Context<StoreContext>;
};

export const useStoreContext = () => {
  const storeContext = useContext(getStoreContext());
  return storeContext;
};

// ------------ keyring context ---------------------

export interface KeyRingContext {
  keyRingController?: SingleHDKeyRingController;
}

let keyringContext: Context<KeyRingContext>;

const getKeyRingContext = (defaultValue?: KeyRingContext) => {
  if (!keyringContext && defaultValue) {
    console.debug("getKeyRingContext", defaultValue);
    keyringContext = React.createContext(defaultValue);
  }
  return keyringContext as Context<KeyRingContext>;
};

export const useKeyRingContext = () => {
  return useContext(getKeyRingContext());
};

export default { getStoreContext, getKeyRingContext };
