import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import vcState from '@/lib/states/corVCJWTState';
import vpState from '@/lib/states/corVPJWTState';
import holderDIDAccountState from '@/lib/states/holderDIDAccount2State';
import verifierDIDAccountState from '@/lib/states/verifierDIDAccount2State';
import issuerDIDAccountState from '@/lib/states/issuerDIDAccount2State';

import * as didvc from '@/lib/didvc';

import { holderPw } from '@/lib/algo/account/accounts';
import { DIDAccount } from '@/lib/types';

const useVPSubmitMain = () => {
  const [vpSubmitted, setVPSubmitted] = useState(false);
  const [vcForDisplay, setVCForDisplay] = useState('');
  const [vpForDisplay, setVPForDisplay] = useState('');
  const [holderDIDAccount, setHolderDIDAccount] = useState<DIDAccount>();
  const [verifierDIDAccount, setVerifierDIDAccount] = useState<DIDAccount>();
  const [issuerDIDAccount, setIssuerDIDAccount] = useState<DIDAccount>();

  const [vcGlobal] = useRecoilState(vcState);
  const [vpGlobal, setVPGlobal] = useRecoilState(vpState);
  const [holderDIDAccountGlobal] = useRecoilState(holderDIDAccountState);
  const [verifierDIDAccountGlobal] = useRecoilState(verifierDIDAccountState);
  const [issuerDIDAccountGlobal] = useRecoilState(issuerDIDAccountState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVPSubmitted(!!vpGlobal);
      setHolderDIDAccount(holderDIDAccountGlobal);
      setVerifierDIDAccount(verifierDIDAccountGlobal);
      setIssuerDIDAccount(issuerDIDAccountGlobal);

      if (
        !vcForDisplay &&
        vcGlobal &&
        holderDIDAccountGlobal &&
        verifierDIDAccountGlobal
      ) {
        const f = async () => {
          const verifiedVC = await didvc.verifyCredentialJWT(vcGlobal);
          setVCForDisplay(
            JSON.stringify(verifiedVC.verifiableCredential, undefined, 2)
          );
        };
        f().catch(errorHandler);
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vcGlobal,
    vpGlobal,
    vcForDisplay,
    holderDIDAccountGlobal,
    verifierDIDAccountGlobal,
    issuerDIDAccountGlobal,
    errorHandler,
  ]);

  const onVPSubmitClickHandler = async () => {
    try {
      if (
        !vpGlobal &&
        vcGlobal &&
        holderDIDAccountGlobal &&
        verifierDIDAccountGlobal
      ) {
        const payload: didvc.PresentationJWTPayload = {
          aud: verifierDIDAccountGlobal.did,
          vp: {
            '@context': [didvc.DEFAULT_CONTEXT],
            type: [didvc.DEFAULT_VP_TYPE],
            verifiableCredential: [vcGlobal],
          },
        };

        const vpJWT = await didvc.createPresentationJWT(
          payload,
          holderDIDAccountGlobal.encryptedSecretKey,
          holderPw
        );
        setVPGlobal(vpJWT);

        const verifiedVP = await didvc.verifyPresentationJWT(
          vpJWT,
          verifierDIDAccountGlobal.did
        );
        setVPForDisplay(
          JSON.stringify(verifiedVP.verifiablePresentation, undefined, 2)
        );
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vcForDisplay,
    vpForDisplay,
    onVPSubmitClickHandler,
    vpSubmitted,
    holderDID: holderDIDAccount?.did,
    holderAddress: holderDIDAccount?.address,
    verifierDID: verifierDIDAccount?.did,
    verifierAddress: verifierDIDAccount?.address,
    issuerDID: issuerDIDAccount?.did,
    issuerAddress: issuerDIDAccount?.address,
  };
};

export default useVPSubmitMain;
