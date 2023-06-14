import React, { FunctionComponent, useEffect, useState } from "react";

import * as ap from "./asyncProcess";
import * as api from "../../shared/apiClient";
import { SessionService } from "../../shared/services";

import { EmailOfferRequestView } from "./EmailOfferRequest.view";
import { OriginatorProfileHolder } from "../../../bundles/src/types";

export interface originatorProfileInThePage {
  firstParty: OriginatorProfileHolder;
  thirdParty: [OriginatorProfileHolder];
}
export const EmailOfferRequest: FunctionComponent = () => {
  const [error, setError] = useState("");
  const [hasBunsin, setHasBunsin] = useState(false);
  const [op, setOP] = useState<originatorProfileInThePage>();
  useEffect(() => {
    (async () => {
      const hasBunsinLogin =
        (await SessionService.currentSession()) !== null ?? false;
      setHasBunsin(hasBunsinLogin);
    })();
    const url = new URL(window.location.href);
    const op = url.searchParams.get("op");
    setOP(JSON.parse(op!));
  }, []);

  const getActiveTab = async (): Promise<chrome.tabs.Tab> => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };
  const sendMessage = async (status: string, email: string = "") => {
    const tab = await getActiveTab();
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, {
        data: {
          type: "quitEmailOfferPopup",
          result: "success",
          status: status,
          email: email,
        },
      });
    }
  };

  const requestCreateAlterEgo = async (name: string): Promise<string> => {
    // get default account email ID.
    const emailResult = await ap.getDefaultAccountEmail();
    let emailId = 0;
    if (emailResult.type === "ok") {
      console.debug(emailResult.data);
      emailId = emailResult.data.id!;
    } else {
      if (emailResult.type === "client_error") {
        console.debug(emailResult.clientErrorInfo.message);
      } else {
        throw emailResult.sourceError;
      }
    }
    // get the hostname of the current site as the AlterEgo name.
    let url: URL;
    const tab = await getActiveTab();
    if (tab) {
      url = new URL(tab.url!);
    }
    const alterEgoName = url!.host;
    // create an AlterEgo and return email.
    const createResult = await ap.createAlterEgo(alterEgoName, emailId);
    if (createResult.type === "ok") {
      console.debug(createResult.data);
      return createResult.data.email?.alterEgoEmail!;
    } else {
      if (createResult.type === "client_error") {
        if (
          createResult.clientErrorInfo.message ===
          ap.expectedClientErrors[
            api.AlterEgoMailAddressReachedMaxCountExceptionNameEnum
              .AlterEgoMailAddressReachedMaxCountException
          ]
        ) {
          setError("ブンシンメールアドレスの取得上限に達しています");
        } else {
          setError(`error.${createResult.clientErrorInfo.message}.message`);
        }
      } else {
        throw createResult.sourceError;
      }
    }
    return "";
  };

  return (
    <EmailOfferRequestView
      error={error}
      hasBunsin={hasBunsin}
      sendMessage={sendMessage}
      requestCreateAlterEgo={requestCreateAlterEgo}
      originatorProfile={op}
    />
  );
};
