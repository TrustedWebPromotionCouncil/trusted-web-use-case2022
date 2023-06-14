import React, { FunctionComponent, useEffect, useState } from "react";
import * as ReactDOM from "react-dom/client";
import {
  Route,
  Link,
  MemoryRouter,
  Routes,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { initialState, reducer } from "@/store";
import context from "@/Context";
import { BlockingSetting } from "./blockingSetting/BlockingSetting";
import { Option } from "./option/Option";

import "@/custom.scss";
import "@/index.scss";

const Layout: FunctionComponent = () => {
  return (
    <>
      <div className="container">
        <ul className="nav">
          <li className="nav-item">
            <Link to={"option-setting"} className="nav-link">
              option setting
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"block-setting"} className="nav-link">
              block setting
            </Link>
          </li>
        </ul>
        <Outlet />
      </div>
    </>
  );
};
const TabRouter: FunctionComponent = () => (
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Option />} />
        <Route path={"option-setting"} element={<Option />} />
        <Route path={"block-setting"} element={<BlockingSetting />} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const Tab: React.VFC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const defaultStoreValue = { state, dispatch };
  const StoreContext = context.getStoreContext(defaultStoreValue);
  useEffect(() => {}, []);
  return (
    <StoreContext.Provider value={defaultStoreValue}>
      <TabRouter />
    </StoreContext.Provider>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <>
    <Tab />
  </>
);
