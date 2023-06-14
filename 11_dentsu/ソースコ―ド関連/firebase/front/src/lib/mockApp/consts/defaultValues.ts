import {
  AccountContent,
  ResidentContent,
  TaxContent,
  SubsidyContent,
} from '../types';

export const ResidentInputDefault: ResidentContent = {
  fullName: '',
  fullNameFurigana: '',
  address: '',
  addressRegistYear: '',
  addressRegistMonth: '',
  addressRegistDate: '',
  permanentAddress: '',
} as const;

export const AccountInputDefault: AccountContent = {
  bankCode: '',
  branchNumber: '',
  accountNumber: '',
  corporateName: '',
  fullName: '',
  address: '',
} as const;

export const TaxInputDefault: TaxContent = {
  applicationYear: '',
  corporationName: '',
  corporationAddress: '',
  fullName: '',
  address: '',
} as const;

export const SubsidyInputDefault: SubsidyContent = {
  residentVC: '',
  accountVC: '',
  taxVC: '',
  fullName: '',
  address: '',
  vp: '',
} as const;
