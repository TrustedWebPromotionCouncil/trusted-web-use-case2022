import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Setting } from "@/store";
import ds from "@/utils/dataStore";
import { OptionView } from "./Option.view";

export const Option: FunctionComponent = () => {
  const [setting, setSetting] = useState<Setting>();
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  const onSubmit = async (setting: Setting) => {
    console.debug("save setting", setting);
    await ds.setSetting(setting);
  };

  useEffect(() => {
    (async () => {
      const _setting = await ds.getSetting();
      setSetting(_setting);
    })();
  }, []);
  return (
    (setting && (
      <OptionView setting={setting} onSubmit={onSubmit} onBack={onBack} />
    )) || <></>
  );
};
