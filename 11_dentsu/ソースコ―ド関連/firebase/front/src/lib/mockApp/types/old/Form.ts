import { ResidentInputFormType, AccountInputFormType } from "./inputForm"

export type Message<T = any> = {
    senderDid: string;
    receiverDid: string;
    content: T;
  };
export type VerifiableMessage<T = any> = {
    message: Message<T>;
    signature: string;
  };
  
  export type VerifiableCredentialContent<T = any> = {
    appIndex: number;
    content: T;
  };
  
  export type VerifiablePresentationContent = {
    credentials: VerifiableCredential[];
  };
  
  export type VerifiableCredential<T = any> = VerifiableMessage<
    VerifiableCredentialContent<T>
  >;

export type baseType = {
    applicationDate: string;
    issueDate?: string;
    verifyStatus: boolean;
    approvalStatus: boolean;
}

export type TaxInputFormType = {
    id: number;
    applicationYear: string;
    corporationName: string;
    corporationAddress: string;
    fullName: string;
    address: string;
} & baseType;

export type ResidentVCRequestType = VerifiableMessage<ResidentInputFormType>
export type AccountVCRequestType = VerifiableMessage<AccountInputFormType>
export type TaxVCRequestType = VerifiableMessage<TaxInputFormType>
export type SubsidyVCRequestType = VerifiableMessage<SubsidyInputFormType>


export type ResidentVCType = VerifiableMessage<VerifiableCredentialContent<ResidentInputFormType>>
export type AccountVCType = VerifiableMessage<VerifiableCredentialContent<AccountInputFormType>>
export type TaxVCType = VerifiableMessage<VerifiableCredentialContent<TaxInputFormType>>
export type SubsidyVCType = VerifiableMessage<VerifiableCredentialContent<SubsidyInputFormType>>

export type SubsidyInputFormType = {
    id: number;
    residentVC: string;
    accountVC: string;
    taxVC: string;
    fullName: string;
    address: string;
    residentVP: VerifiableMessage<VPContent> | undefined;
    accountVP: VerifiableMessage<VPContent> | undefined;
    taxVP: VerifiableMessage<VPContent> | undefined;
} & baseType;


export type VCListType = {
    resident: ResidentVCType[];
    account: AccountVCType[];
    tax: TaxVCType[];
    subsidy: SubsidyVCType[];
}

export type VPContent = {
    credentials: VerifiableCredential[];
}