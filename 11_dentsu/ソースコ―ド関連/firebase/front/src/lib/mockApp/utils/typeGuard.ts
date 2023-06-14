import {
  AccountContent,
  ResidentContent,
  SubsidyContent,
  TaxContent,
} from '../types';

export const isResidentContent = (
  content: unknown
): content is ResidentContent =>
  typeof content === 'object' &&
  content !== null &&
  typeof (content as ResidentContent).address === 'string' &&
  typeof (content as ResidentContent).addressRegistDate === 'string' &&
  typeof (content as ResidentContent).addressRegistMonth === 'string' &&
  typeof (content as ResidentContent).addressRegistYear === 'string' &&
  typeof (content as ResidentContent).fullName === 'string' &&
  typeof (content as ResidentContent).fullNameFurigana === 'string' &&
  typeof (content as ResidentContent).permanentAddress === 'string';

export const isAccountContent = (content: unknown): content is AccountContent =>
  typeof content === 'object' &&
  content !== null &&
  typeof (content as AccountContent).accountNumber === 'string' &&
  typeof (content as AccountContent).address === 'string' &&
  typeof (content as AccountContent).bankCode === 'string' &&
  typeof (content as AccountContent).branchNumber === 'string' &&
  typeof (content as AccountContent).corporateName === 'string' &&
  typeof (content as AccountContent).fullName === 'string';

export const isTaxContent = (content: unknown): content is TaxContent =>
  typeof content === 'object' &&
  content !== null &&
  typeof (content as TaxContent).address === 'string' &&
  typeof (content as TaxContent).applicationYear === 'string' &&
  typeof (content as TaxContent).corporationAddress === 'string' &&
  typeof (content as TaxContent).corporationName === 'string' &&
  typeof (content as TaxContent).fullName === 'string';

export const isSubsidyContent = (content: unknown): content is SubsidyContent =>
  typeof content === 'object' &&
  content !== null &&
  typeof (content as SubsidyContent).accountVC === 'string' &&
  typeof (content as SubsidyContent).address === 'string' &&
  typeof (content as SubsidyContent).fullName === 'string' &&
  typeof (content as SubsidyContent).residentVC === 'string' &&
  typeof (content as SubsidyContent).taxVC === 'string' &&
  typeof (content as SubsidyContent).vp === 'string';
