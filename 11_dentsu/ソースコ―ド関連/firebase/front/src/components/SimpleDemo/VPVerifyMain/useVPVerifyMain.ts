import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import corVPState from '@/lib/states/corVPState';
import corVPVerifiedState from '@/lib/states/corVPVerifiedState';
import chainState from '@/lib/states/chainState';
import holderDidAccountState from '@/lib/states/holderDidAccountState';
import verifierDidAccountState from '@/lib/states/verifierDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';

import { getAlgod } from '@/lib/algo/algod/algods';

import { verifyVerifiablePresentation } from '@/lib/algosbt';
import { DidAccount } from '@/lib/algosbt/types';

const useVPVerifyMain = () => {
  const [vpVerified, setVPVerified] = useState(false);
  const [vm, setVM] = useState('');
  const [holderDidAccount, setHolderDidAccount] = useState<DidAccount>();
  const [verifierDidAccount, setVerifierDidAccount] = useState<DidAccount>();
  const [issuerDidAccount, setIssuerDidAccount] = useState<DidAccount>();

  const [vpGlobal] = useRecoilState(corVPState);
  const [vpVerifiedGlobal, setVPVerifiedGlobal] =
    useRecoilState(corVPVerifiedState);
  const [holderDidAccountGlobal] = useRecoilState(holderDidAccountState);
  const [verifierDidAccountGlobal] = useRecoilState(verifierDidAccountState);
  const [issuerDidAccountGlobal] = useRecoilState(issuerDidAccountState);
  const [chain] = useRecoilState(chainState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVPVerified(vpVerifiedGlobal);
      setHolderDidAccount(holderDidAccountGlobal);
      setVerifierDidAccount(verifierDidAccountGlobal);
      setIssuerDidAccount(issuerDidAccountGlobal);

      if (!vm && vpGlobal) {
        setVM(JSON.stringify(vpGlobal, undefined, 2));
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vpGlobal,
    vpVerifiedGlobal,
    vm,
    holderDidAccountGlobal,
    issuerDidAccountGlobal,
    verifierDidAccountGlobal,
    errorHandler,
  ]);

  const onVPVerifyClickHandler = async () => {
    try {
      if (!vpVerifiedGlobal && vpGlobal) {
        const algod = getAlgod(chain);
        const verified = await verifyVerifiablePresentation(algod, vpGlobal);

        setVPVerifiedGlobal(verified.vpVerified);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vm,
    onVPVerifyClickHandler,
    vpVerified,
    holderDidAccount,
    verifierDidAccount,
    issuerDidAccount,
  };
};

export default useVPVerifyMain;
