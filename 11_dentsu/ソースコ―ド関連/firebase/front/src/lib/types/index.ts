import { VerifiableCredential, VerifiableMessage } from '../algosbt/types';

export type ErrorHandlerType = (error: unknown) => void;

export enum ChainType {
  MainNet = 'MainNet',
  TestNet = 'TestNet',
}

export type DIDAccount = {
  did: string;
  address: string;
  encryptedSecretKey: string;
};

export type Revocable = {
  appIndex: number;
};

export type CORVCRequestContent = {
  purpose: string;
  address: string;
  name: string;
};

export type CORVCContent = {
  address: string;
  name: string;
};

export type CORVPRequestContent = {
  purpose: string;
};

export type CORVPContent = {
  credentials: VerifiableCredential[];
};

export type CORVCRequest = VerifiableMessage<CORVCRequestContent>;

export type CORVC = VerifiableCredential<CORVCContent>;

export type CORVPRequest = VerifiableMessage<CORVPRequestContent>;

export type CORVP = VerifiableMessage<CORVPContent>;
