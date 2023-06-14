import axios from "axios";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { LOCAL_STORAGE_TRANSACTION_ID } from "../configs/constants";
import { VCRequest } from "../types";
import { getTransaction, updateTransaction } from "./repository/transaction";
import { addVCHistory, getVC } from "./repository/vc";
import { Signer } from "./signer";
import { translateText } from "./translate/translateText";
import { updateTransactionDataByPresentationVCType } from "./utils";

interface Descriptor {
  id?: string;
  path?: string;
  encoding?: string;
  format?: string;
  path_nested?: {
    id?: string;
    format?: string;
    path?: string;
  };
}

export const present = async (
  presentationVCIDs: string[],
  signer: Signer,
  vcRequest: VCRequest
): Promise<{ transactionID: string }> => {
  const vcs = [];
  const descriptor_map: [Descriptor?] = [];
  for (let i = 0; presentationVCIDs.length > i; i++) {
    // 選択したVCを抽出する
    const vc = await getVC(presentationVCIDs[i]);
    vcs.push(vc.vc);
    descriptor_map.push({
      path: `$`,
      id: `${vcRequest.claims.vp_token.presentation_definition.input_descriptors[i].id}`,
      format: vc.format === "jwt_vc" ? "jwt_vc" : "JSON-LD",
      path_nested: {
        id: `${vcRequest.claims.vp_token.presentation_definition.input_descriptors[i].id}`,
        format: vc.format === "jwt_vc" ? "jwt_vc" : "JSON-LD",
        path: `$.verifiableCredential[${i}]`,
      },
    });
  }

  const vp = await signer.createVP({
    vcs,
    verifierDID: vcRequest.client_id,
    nonce: vcRequest.nonce,
  });

  const _vp_token = {
    presentation_submission: {
      definition_id: vcRequest.claims.vp_token.presentation_definition.id,
      descriptor_map,
      id: uuidv4().toUpperCase(),
    },
  };

  const verifyRequestIdToken = await signer.siopV2({
    aud: vcRequest.client_id,
    nonce: vcRequest.nonce,
    _vp_token,
  });

  await axios.post(
    vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
    new URLSearchParams({
      id_token: verifyRequestIdToken,
      vp_token: vp,
      state: vcRequest.state,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  // Credentialの履歴を追加する
  await Promise.all(
    presentationVCIDs.map(async (presentationVCID) => {
      await addVCHistory(presentationVCID, {
        timestamp: moment().unix(),
        message: `${translateText(vcRequest.client_id)}にVCを提示しました`,
      });
    })
  );

  // VCに関連するtransactionを取得して更新する
  const transactionID = localStorage.getItem(LOCAL_STORAGE_TRANSACTION_ID);
  const transaction = await getTransaction(transactionID);
  const newTransaction = updateTransactionDataByPresentationVCType(transaction, vcRequest);
  await updateTransaction(transactionID, newTransaction);

  return { transactionID };
};
