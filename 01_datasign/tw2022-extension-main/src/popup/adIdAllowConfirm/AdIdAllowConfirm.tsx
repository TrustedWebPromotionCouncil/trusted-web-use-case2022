import React, { FunctionComponent, useState } from "react";

import { AdIdAllowConfirmView } from "./AdIdAllowConfirm.view";
import { AdUsage } from "../../store/types";

export const AdIdAllowConfirm: FunctionComponent = () => {
  const getActiveTabId = async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
  };

  const sendMessage = async (status: string, adIdUsage: AdUsage[] = []) => {
    const tabId = await getActiveTabId();
    if (tabId) {
      await chrome.tabs.sendMessage(tabId, {
        data: {
          type: "quitNgPopup",
          result: "success",
          status: status,
          adIdUsage: adIdUsage,
        },
      });
    }
  };

  return <AdIdAllowConfirmView sendMessage={sendMessage} />;
};
