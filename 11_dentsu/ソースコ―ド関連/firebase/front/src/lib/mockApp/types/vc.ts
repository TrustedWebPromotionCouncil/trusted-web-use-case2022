import { VerifiedCredentialJWT, VerifiedJWT } from '@/lib/didvc';

// Resident
export type ResidentContent = {
  fullName: string; // 氏名
  fullNameFurigana: string; // 氏名フリガナ
  address: string; // 住所
  addressRegistYear: string; // 住民となった年
  addressRegistMonth: string; // 住民となった月
  addressRegistDate: string; //住民となった年月
  permanentAddress: string; // 本籍地
};

export type VerifiedRVCReqListItem = {
  id: string;
  jwt: VerifiedJWT<ResidentContent>;
};

export type VerifiedRVCReqList = VerifiedRVCReqListItem[];

export type VerifiedRVCListItem = {
  id: string;
  jwt: VerifiedCredentialJWT<ResidentContent>;
};

export type VerifiedRVCList = VerifiedRVCListItem[];

// Account
export type AccountContent = {
  bankCode: string; // 金融機関コード
  branchNumber: string; // 支店番号
  accountNumber: string; // 口座番号
  corporateName: string; // 法人名称
  fullName: string; // 申請者名
  address: string; // 申請住所
};

export type VerifiedAVCReqListItem = {
  id: string;
  jwt: VerifiedJWT<AccountContent>;
};

export type VerifiedAVCReqList = VerifiedAVCReqListItem[];

export type VerifiedAVCListItem = {
  id: string;
  jwt: VerifiedCredentialJWT<AccountContent>;
};

export type VerifiedAVCList = VerifiedAVCListItem[];

// Tax
export type TaxContent = {
  applicationYear: string; //申請年度
  corporationName: string; //法人名称
  corporationAddress: string; //所在地
  fullName: string; // 申請者名
  address: string; // 申請住所
};

export type VerifiedTVCReqListItem = {
  id: string;
  jwt: VerifiedJWT<TaxContent>;
};

export type VerifiedTVCReqList = VerifiedTVCReqListItem[];

export type VerifiedTVCListItem = {
  id: string;
  jwt: VerifiedCredentialJWT<TaxContent>;
};

export type VerifiedTVCList = VerifiedVCListItem[];

// Subsidy
export type SubsidyContent = {
  residentVC: string; //住民票VC
  accountVC: string; //口座実在証明書VC
  taxVC: string; // 納税証明書VC
  fullName: string; // 申請者名
  address: string; // 申請住所
  vp: string; //VP
};

export type VerifiedSVCReqListItem = {
  id: string;
  jwt: VerifiedJWT<SubsidyContent>;
};

export type VerifiedSVCReqList = VerifiedSVCReqListItem[];

export type VerifiedSVCListItem = {
  id: string;
  jwt: VerifiedCredentialJWT<SubsidyContent>;
};

export type VerifiedSVCList = VerifiedSVCListItem[];

// Encoded JWT
export type VCReqListItem = {
  id: string;
  jwt: string;
};

export type VCReqList = VCReqListItem[];

export type VCListItem = {
  id: string;
  jwt: string;
};

export type VCList = VCListItem[];

// Abstract
export type VCContent =
  | ResidentContent
  | AccountContent
  | TaxContent
  | SubsidyContent;

export type VerifiedVCReqListItem = {
  id: string;
  jwt: VerifiedJWT<VCContent>;
};

export type VerifiedVCReqList = VerifiedVCReqListItem[];

export type VerifiedVCListItem = {
  id: string;
  jwt: VerifiedCredentialJWT<VCContent>;
};

export type VerifiedVCList = VerifiedVCListItem[];
