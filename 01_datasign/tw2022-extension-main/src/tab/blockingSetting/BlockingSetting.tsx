import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BlockingSettingView } from "./BlockingSetting.view";

export const BlockingSetting: FunctionComponent = () => {
  const [rules, setRules] = useState<chrome.declarativeNetRequest.Rule[]>([]);
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };
  const onRestoreRules = async () => {
    await chrome.runtime.sendMessage({
      data: {
        type: "restoreBlockingRules",
      },
    });
  };
  const onClearNonDefaultRules = async () => {
    await chrome.runtime.sendMessage({
      data: {
        type: "clearNonDefaultRules",
      },
    });
  };

  useEffect(() => {
    (async () => {
      const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
      setRules(sessionRules);
    })();
  }, []);
  return (
    <BlockingSettingView
      rules={rules}
      onBack={onBack}
      onRestoreRules={onRestoreRules}
      onClearNonDefaultRules={onClearNonDefaultRules}
    />
  );
};
