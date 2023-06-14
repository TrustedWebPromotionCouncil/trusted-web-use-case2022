import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import corVCState from '@/lib/states/corVCState';
import corVPState from '@/lib/states/corVPState';
import holderDidAccountState from '@/lib/states/holderDidAccountState';
import verifierDidAccountState from '@/lib/states/verifierDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';

import { CORVPContent } from '@/lib/types';

import { createVerifiableMessage } from '@/lib/algosbt';
import { holderPw } from '@/lib/algo/account/accounts';
import { VerifiableCredential, DidAccount } from '@/lib/algosbt/types';

const createVPContent = (vc: VerifiableCredential) => {
  const content: CORVPContent = {
    credentials: [vc],
  };

  return content;
};
const createVPMessage = (
  content: CORVPContent,
  holderDidAccount: DidAccount,
  verifierDid: string
) => {
  return createVerifiableMessage(
    holderDidAccount,
    verifierDid,
    content,
    holderPw
  );
};

const useVPSubmitMain = () => {
  const [vpSubmitted, setVPSubmitted] = useState(false);
  const [vm, setVM] = useState('');
  const [holderDidAccount, setHolderDidAccount] = useState<DidAccount>();
  const [verifierDidAccount, setVerifierDidAccount] = useState<DidAccount>();
  const [issuerDidAccount, setIssuerDidAccount] = useState<DidAccount>();

  const [vcGlobal] = useRecoilState(corVCState);
  const [vpGlobal, setVPGlobal] = useRecoilState(corVPState);
  const [holderDidAccountGlobal] = useRecoilState(holderDidAccountState);
  const [verifierDidAccountGlobal] = useRecoilState(verifierDidAccountState);
  const [issuerDidAccountGlobal] = useRecoilState(issuerDidAccountState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVPSubmitted(!!vpGlobal);
      setHolderDidAccount(holderDidAccountGlobal);
      setVerifierDidAccount(verifierDidAccountGlobal);
      setIssuerDidAccount(issuerDidAccountGlobal);

      if (
        !vm &&
        vcGlobal &&
        holderDidAccountGlobal &&
        verifierDidAccountGlobal
      ) {
        const content = createVPContent(vcGlobal);
        const vmForDisplay = createVPMessage(
          content,
          holderDidAccountGlobal,
          verifierDidAccountGlobal.did
        );
        setVM(JSON.stringify(vmForDisplay, undefined, 2));
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vcGlobal,
    vpGlobal,
    vm,
    holderDidAccountGlobal,
    verifierDidAccountGlobal,
    issuerDidAccountGlobal,
    errorHandler,
  ]);

  const onVPSubmitClickHandler = () => {
    try {
      if (
        !vpGlobal &&
        vcGlobal &&
        holderDidAccountGlobal &&
        verifierDidAccountGlobal
      ) {
        const content = createVPContent(vcGlobal);
        const vm = createVPMessage(
          content,
          holderDidAccountGlobal,
          verifierDidAccountGlobal.did
        );
        setVPGlobal(vm);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vm,
    onVPSubmitClickHandler,
    vpSubmitted,
    holderDidAccount,
    verifierDidAccount,
    issuerDidAccount,
  };
};

export default useVPSubmitMain;
