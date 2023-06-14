import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getProvidedHistories } from "@/utils/dataStore";
import { VCListView, ProvidedHistoryForView, VCType, VC } from "./VCList.view";
import { DIDState } from "@/did/types";
import { ProvidedHistory } from "@/store/types";

type FlattenedHistory = ProvidedHistory & {
  pairwiseAccount: { didState: Omit<DIDState, "ops"> };
};

const pathToType: { [key: string]: VCType } = {
  "/vcListNonBot": "notBot",
  "/vcListAdId": "ad",
  "/vcListEmail": "mailAddress",
};

const vcByType = (vcType: VCType, history: FlattenedHistory): VC => {
  if (vcType === "notBot") {
    return { type: vcType, ...history.notBot! };
  } else if (vcType === "ad") {
    return { type: vcType, ...history.adId! };
  } else {
    return { type: vcType, mailAddress: history.mailAddress || "" };
  }
};
export const VCList: FunctionComponent = () => {
  const [histories, setHistories] = useState<ProvidedHistoryForView[]>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const vcType = pathToType[pathname];
      const data = await getProvidedHistories();
      const flattened: FlattenedHistory[] = [];
      for (const h of data.histories) {
        const { thirdParties, ...rest } = h;
        const { pairwiseAccount } = rest;
        flattened.push(rest);
        for (const subH of thirdParties) {
          flattened.push({
            ...subH,
            pairwiseAccount,
          });
        }
      }
      const _histories: ProvidedHistoryForView[] = flattened
        .filter((h) => {
          if (vcType === "notBot") {
            return h.notBot !== undefined;
          } else if (vcType === "ad") {
            return h.adId !== undefined;
          } else {
            return h.mailAddress !== undefined;
          }
        })
        .map((h) => {
          const { did, url } = h;
          const pairwiseAccount = h.pairwiseAccount.didState;
          return {
            vcType,
            recipient: { did, url, pairwiseAccount },
            date: h.createdAt,
            vc: vcByType(vcType, h),
          };
        });
      setHistories(_histories);
    })();
  }, []);
  const onBack = () => {
    navigate(-1);
  };
  return (
    <VCListView
      vcType={pathToType[pathname]}
      histories={histories}
      onBack={onBack}
    />
  );
};
