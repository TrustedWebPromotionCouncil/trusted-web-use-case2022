import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { MenuView } from "./Menu.view";

export const Menu: FunctionComponent = () => {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    console.log("path -> " + path);
    if (path === "otherSetting") {
      window.open(chrome.runtime.getURL("/tab.html"));
    } else {
      navigate(path);
    }
  };
  const onBack = () => {
    navigate(-1);
  };

  return <MenuView goTo={goTo} onBack={onBack} />;
};
