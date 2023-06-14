import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import * as didvc from '@/lib/didvc';
import { CORVCRequestContent } from '@/lib/types';

import { holderPw } from '@/lib/algo/account/accounts';
import corVCRequestJWTState from '@/lib/states/corVCRequestJWTState';
import holderDIDAccountState from '@/lib/states/holderDIDAccount2State';
import issuerDIDAccountState from '@/lib/states/issuerDIDAccount2State';
import { DIDAccount } from '@/lib/types';

const myContent: CORVCRequestContent = {
  purpose: '住民票の発行依頼',
  address: '東京都港区',
  name: 'ISID',
};

const createCORVCRequestJWT = async (
  holderEncryptedSecretKey: string,
  issuerDID: string
): Promise<string> => {
  const payload: didvc.JWTPayload<CORVCRequestContent> = {
    aud: issuerDID,
    ...myContent,
  };

  return didvc.createJWT(payload, holderEncryptedSecretKey, holderPw);
};

const useVCRequestMain = () => {
  const [requestResult, setRequestResult] = useState('');
  const [vcRequested, setVCRequested] = useState(false);
  const [holderDIDAccount, setHolderDIDAccount] = useState<DIDAccount>();
  const [issuerDIDAccount, setIssuerDIDAccount] = useState<DIDAccount>();
  const [vcRequestGlobal, setVCRequestGlobal] =
    useRecoilState(corVCRequestJWTState);
  const [holderDIDAccountGlobal] = useRecoilState(holderDIDAccountState);
  const [issuerDIDAccountGlobal] = useRecoilState(issuerDIDAccountState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVCRequested(!!vcRequestGlobal);
      setHolderDIDAccount(holderDIDAccountGlobal);
      setIssuerDIDAccount(issuerDIDAccountGlobal);
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vcRequestGlobal,
    holderDIDAccountGlobal,
    issuerDIDAccountGlobal,
    errorHandler,
  ]);

  const onVCRequestClickHandler = () => {
    try {
      if (
        !vcRequestGlobal &&
        holderDIDAccountGlobal &&
        issuerDIDAccountGlobal
      ) {
        const f = async () => {
          const jwt = await createCORVCRequestJWT(
            holderDIDAccountGlobal.encryptedSecretKey,
            issuerDIDAccountGlobal.did
          );
          setVCRequestGlobal(jwt);
          const verifiedJWT = await didvc.verifyJWT(
            jwt,
            issuerDIDAccountGlobal.did
          );

          setRequestResult(JSON.stringify(verifiedJWT, undefined, 2));
        };
        f().catch(errorHandler);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    requestContent: JSON.stringify(myContent, undefined, 2),
    requestResult,
    vcRequested,
    holderDID: holderDIDAccount?.did,
    holderAddress: holderDIDAccount?.address,
    issuerDID: issuerDIDAccount?.did,
    issuerAddress: issuerDIDAccount?.address,
    onVCRequestClickHandler,
  };
};

export default useVCRequestMain;
