import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import vpState from '@/lib/states/corVPJWTState';
import vpVerifiedState from '@/lib/states/corVPVerifiedState';
import chainState from '@/lib/states/chainState';
import holderDIDAccountState from '@/lib/states/holderDIDAccount2State';
import verifierDIDAccountState from '@/lib/states/verifierDIDAccount2State';
import issuerDIDAccountState from '@/lib/states/issuerDIDAccount2State';

import { getAlgod } from '@/lib/algo/algod/algods';
import * as didvc from '@/lib/didvc';

import { DIDAccount } from '@/lib/types';

const useVPVerifyMain = () => {
  const [vpVerified, setVPVerified] = useState(false);
  const [vpForDisplay, setVPForDisplay] = useState('');
  const [holderDIDAccount, setHolderDIDAccount] = useState<DIDAccount>();
  const [verifierDIDAccount, setVerifierDIDAccount] = useState<DIDAccount>();
  const [issuerDIDAccount, setIssuerDIDAccount] = useState<DIDAccount>();

  const [vpGlobal] = useRecoilState(vpState);
  const [vpVerifiedGlobal, setVPVerifiedGlobal] =
    useRecoilState(vpVerifiedState);
  const [holderDIDAccountGlobal] = useRecoilState(holderDIDAccountState);
  const [verifierDIDAccountGlobal] = useRecoilState(verifierDIDAccountState);
  const [issuerDIDAccountGlobal] = useRecoilState(issuerDIDAccountState);
  const [chain] = useRecoilState(chainState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVPVerified(vpVerifiedGlobal);
      setHolderDIDAccount(holderDIDAccountGlobal);
      setVerifierDIDAccount(verifierDIDAccountGlobal);
      setIssuerDIDAccount(issuerDIDAccountGlobal);

      if (!vpForDisplay && vpGlobal && verifierDIDAccountGlobal) {
        const f = async () => {
          const verifiedVP = await didvc.verifyPresentationJWT(
            vpGlobal,
            verifierDIDAccountGlobal.did
          );

          setVPForDisplay(
            JSON.stringify(verifiedVP.verifiablePresentation, undefined, 2)
          );
        };

        f().catch(errorHandler);
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vpGlobal,
    vpVerifiedGlobal,
    vpForDisplay,
    holderDIDAccountGlobal,
    issuerDIDAccountGlobal,
    verifierDIDAccountGlobal,
    errorHandler,
    chain,
    setVPVerifiedGlobal,
  ]);

  const onVPVerifyClickHandler = async () => {
    try {
      if (!vpVerifiedGlobal && vpGlobal && verifierDIDAccountGlobal) {
        const verifiedVP = await didvc.verifyPresentationJWT(
          vpGlobal,
          verifierDIDAccountGlobal.did
        );
        const algod = getAlgod(chain);
        const vcStatuses = await didvc.verifyCredentialStatuses(
          algod,
          verifiedVP.verifiablePresentation.verifiableCredential
        );

        setVPVerifiedGlobal(vcStatuses.every((status) => status));
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vpForDisplay,
    vpVerified,
    holderDID: holderDIDAccount?.did,
    holderAddress: holderDIDAccount?.address,
    verifierDID: verifierDIDAccount?.did,
    verifierAddress: verifierDIDAccount?.address,
    issuerDID: issuerDIDAccount?.did,
    issuerAddress: issuerDIDAccount?.address,
    onVPVerifyClickHandler,
  };
};

export default useVPVerifyMain;
