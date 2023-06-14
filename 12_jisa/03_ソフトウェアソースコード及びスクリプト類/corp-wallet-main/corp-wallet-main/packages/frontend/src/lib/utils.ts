import jsonwebtoken from "jsonwebtoken";

import { QR_REQUEST_URI_KEY } from "../configs/constants";
import { Manifest, VCRequest } from "../types";
import { StoredTransaction } from "./repository/transaction";

export type VCRequestType = "issue" | "present";

export interface JWTHeader {
  kid: string;
}

export interface VCData {
  vc: {
    type: string[];
    credentialSubject: Record<string, string>;
  };
  jti: string;
  iss: string;
  iat: number;
  exp: number;
}

export const getRequestUrlFromUrlMessage = (message: string) => {
  const urlSearchParams = new URLSearchParams(message);
  const requestUrl = urlSearchParams.get(QR_REQUEST_URI_KEY);
  if (!requestUrl) {
    console.error("QR code does not contains request url");
  }
  console.log("requestUrl", requestUrl);
  return { requestUrl };
};

export const getProtectedHeaderFromVCRequest = (jwt: string): JWTHeader => {
  const { header } = jsonwebtoken.decode(jwt, { complete: true });
  return header as JWTHeader;
};

export const getRequestFromVCRequest = (
  jwt: string
): {
  vcRequestType: VCRequestType;
  vcRequest: VCRequest;
} => {
  const decodedRequestData = <VCRequest>jsonwebtoken.decode(jwt);
  return {
    vcRequestType: decodedRequestData.prompt === "create" ? "issue" : "present",
    vcRequest: decodedRequestData,
  };
};

export const decodeJWTToVCData = (jwt: string): VCData => {
  const vcData = <VCData>jsonwebtoken.decode(jwt);
  return vcData;
};

export const getManifestFromJWT = (jwt: string): Manifest => {
  return <Manifest>jsonwebtoken.decode(jwt);
};

export const updateTransactionDataByVCType = (
  oldTransaction: StoredTransaction,
  vcTypes: string[],
  credentialID?: string
) => {
  let transaction = oldTransaction;

  vcTypes.map((vcType) => {
    if (vcType === "SWCertificate") {
      const vendor = {
        ...oldTransaction.vendor,
        credential: {
          name: "SWCertificate",
          credentialID,
        },
      };
      transaction = { ...oldTransaction, vendor, status: "工業会証明書取得待ち" };
    }

    if (vcType === "IndustryCertificate") {
      const industryAssociation = {
        ...oldTransaction.industryAssociation,
        credential: {
          name: "IndustryCertificate",
          credentialID,
        },
      };
      transaction = { ...oldTransaction, industryAssociation, status: "経営力向上計画書取得待ち" };
    }

    if (vcType === "ApplicationCertificate") {
      const theSmallAndMediumEnterpriseAgency = {
        ...oldTransaction.theSmallAndMediumEnterpriseAgency,
        credential: {
          name: "ApplicationCertificate",
          credentialID,
        },
      };
      transaction = { ...oldTransaction, theSmallAndMediumEnterpriseAgency, status: "税務申告待ち" };
    }
  });
  return transaction;
};

export const updateTransactionDataByPresentationVCType = (oldTransaction: StoredTransaction, vcRequest: VCRequest) => {
  let transaction = oldTransaction;
  const requireVCTypes = vcRequest.claims.vp_token.presentation_definition.input_descriptors.map((requireVC) => {
    return requireVC.id;
  });

  if (
    JSON.stringify(requireVCTypes) ===
    JSON.stringify(["SWCertificate", "IndustryCertificate", "ApplicationCertificate"])
  ) {
    transaction = { ...oldTransaction, status: "申請完了" };
  }

  return transaction;
};
