import axios from "axios";
import moment from "moment";

import { LOCAL_STORAGE_TRANSACTION_ID } from "../configs/constants";
import { AcquiredIdToken, Manifest, VCRequest } from "../types";
import { getTransaction, updateTransaction } from "./repository/transaction";
import { addVCHistory, getVC, saveNewVC } from "./repository/vc";
import { Signer } from "./signer";
import { translateText } from "./translate/translateText";
import { decodeJWTToVCData, updateTransactionDataByVCType } from "./utils";

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

interface IIssueResponse {
  data: {
    vc: string;
  };
}

export const issue = async (
  signer: Signer,
  vcRequest: VCRequest,
  manifest: Manifest,
  acquiredIdToken: AcquiredIdToken,
  presentationVCIDs: string[]
): Promise<{ credentialID: string; transactionID: string }> => {
  const vcs = [];
  let attestations: any = { ...acquiredIdToken };

  const descriptor_map: [Descriptor?] = [];
  for (let i = 0; presentationVCIDs.length > i; i++) {
    // 選択したVCを抽出する
    const vc = await getVC(presentationVCIDs[i]);
    vcs.push(vc.vc);
    descriptor_map.push({
      path: `$`,
      id: `${manifest.input.attestations.presentations[i].id}`,
      format: vc.format === "jwt_vc" ? "jwt_vc" : "JSON-LD",
      path_nested: {
        id: `${manifest.input.attestations.presentations[i].id}`,
        format: vc.format === "jwt_vc" ? "jwt_vc" : "JSON-LD",
        path: `$.verifiableCredential[${i}]`,
      },
    });

    // TODO: この実装は実験的なものであり、本来は1つのVPに複数のVCを入れるべきだと思う
    const vcArray = [vc.vc];
    const vp = await signer.createVP({
      vcs: vcArray,
      verifierDID: vcRequest.client_id,
      nonce: vcRequest.nonce,
    });

    attestations = {
      ...attestations,
      presentations: {
        [manifest.input.attestations.presentations[i].credentialType]: vp,
      },
    };
  }

  const issueRequestIdToken = await signer.siop({
    aud: manifest.input.credentialIssuer,
    contract: manifest.display.contract,
    attestations,
  });

  const issueResponse = await axios.post<string, IIssueResponse>(manifest.input.credentialIssuer, issueRequestIdToken, {
    headers: { "Content-Type": "text/plain" },
  });
  const vc = issueResponse.data.vc;
  const vcDecodedData = decodeJWTToVCData(vc);

  // VCに関連するtransactionを取得する
  const transactionID = localStorage.getItem(LOCAL_STORAGE_TRANSACTION_ID);
  const transaction = await getTransaction(transactionID);

  // TODO: formatは動的に設定する
  const credentialID = await saveNewVC({
    format: "jwt_vc",
    vc: vc,
    manifest,
    type: vcDecodedData.vc.type,
    credentialSubject: vcDecodedData.vc.credentialSubject,
    vcHistory: [
      { timestamp: moment().unix(), message: `${translateText(manifest.display.card.issuedBy)}から発行されました` },
    ],
    relatedTransactions: [
      {
        transactionID,
        title: transaction.title,
      },
    ],
  });

  // Credentialの履歴を追加する
  await Promise.all(
    presentationVCIDs.map(async (presentationVCID) => {
      await addVCHistory(presentationVCID, {
        timestamp: moment().unix(),
        message: `${translateText(vcRequest.client_id)}にVCを提示しました`,
      });
    })
  );

  // transactionにVCのIDを追加する
  const newTransaction = updateTransactionDataByVCType(transaction, vcDecodedData.vc.type, credentialID);
  await updateTransaction(transactionID, newTransaction);

  await axios.post(vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id, {
    state: vcRequest.state,
    code: "issuance_successful",
  });

  return { credentialID, transactionID };
};
