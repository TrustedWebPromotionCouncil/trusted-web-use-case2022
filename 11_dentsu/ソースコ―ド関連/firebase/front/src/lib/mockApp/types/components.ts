import { VerifiedCredentialJWT, VerifiedJWT } from '@/lib/didvc';
import { VerifiedVCReqListItem, VerifiedVCListItem, VCContent } from './vc';

export type ApplicationStatus = {
  approvalStatus: boolean;
  issuedStatus?: boolean;
  revokeStatus?: boolean;
};

export type ApplicationInfo = {
  id: string;
  fullName: string;
  req: VerifiedJWT<VCContent>;
  vc?: string;
  ApplicationStatus: ApplicationStatus;
  applicationDate: string;
  sortIdx?: string;
};

export type VCInfo = {
  id: string;
  fullName: string;
  vc: VerifiedCredentialJWT<VCContent>;
  ApplicationStatus: ApplicationStatus;
  sortIdx?: string;
  applicationDate: string;
  issueDate: string;
};

export type verifyVPResultType = {
  residentVerifyStatus: boolean;
  accountVerifyStatus: boolean;
  taxVerifyStatus: boolean;
};
