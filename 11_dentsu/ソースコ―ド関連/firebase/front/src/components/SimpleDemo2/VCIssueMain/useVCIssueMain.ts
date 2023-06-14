import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import { getAlgod } from '@/lib/algo/algod/algods';

import { DIDAccount } from '@/lib/types';

import chainState from '@/lib/states/chainState';
import vcState from '@/lib/states/corVCJWTState';
import vcRequestState from '@/lib/states/corVCRequestJWTState';
import holderDIDAccountState from '@/lib/states/holderDIDAccount2State';
import issuerDIDAccountState from '@/lib/states/issuerDIDAccount2State';
import * as didvc from '@/lib/didvc';
import { CORVCContent, CORVCRequestContent } from '@/lib/types';

import { issuerPw } from '@/lib/algo/account/accounts';

const createVCContent = (vcRequestContent: CORVCRequestContent) => {
  const content: CORVCContent = { ...vcRequestContent };

  return content;
};

const useVCIssueMain = () => {
  const [issueTimestamp, setIssueTimestamp] = useState(0);
  const [vcIssued, setVCIssued] = useState(false);
  const [vcIssuing, setVCIssuing] = useState(false);
  const [vcRequestForDisplay, setVCRequestForDisplay] = useState('');
  const [vcContent, setVCContent] = useState<CORVCContent>();
  const [vcForDisplay, setVCForDisplay] = useState('');

  const [holderDIDAccount, setHolderDIDAccount] = useState<DIDAccount>();
  const [issuerDIDAccount, setIssuerDIDAccount] = useState<DIDAccount>();

  const [chainType] = useRecoilState(chainState);
  const [vcRequestGlobal] = useRecoilState(vcRequestState);
  const [vcGlobal, setVCGlobal] = useRecoilState(vcState);
  const [holderDIDAccountGlobal] = useRecoilState(holderDIDAccountState);
  const [issuerDIDAccountGlobal] = useRecoilState(issuerDIDAccountState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVCIssued(!!vcGlobal);
      setHolderDIDAccount(holderDIDAccountGlobal);
      setIssuerDIDAccount(issuerDIDAccountGlobal);

      if (vcIssuing && !!vcGlobal) {
        setVCIssuing(false);
      }

      if (vcRequestGlobal && !vcRequestForDisplay && issuerDIDAccountGlobal) {
        const f = async () => {
          const verifiedJWT = await didvc.verifyJWT<CORVCRequestContent>(
            vcRequestGlobal,
            issuerDIDAccountGlobal.did
          );

          setVCContent(createVCContent(verifiedJWT.payload));
          setVCRequestForDisplay(
            JSON.stringify(verifiedJWT.payload, undefined, 2)
          );
        };
        f().catch(errorHandler);
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vcGlobal,
    vcRequestGlobal,
    vcIssuing,
    vcRequestForDisplay,
    issuerDIDAccountGlobal,
    holderDIDAccountGlobal,
    errorHandler,
  ]);

  const onIssueVCHandler = async () => {
    try {
      if (
        vcRequestGlobal &&
        !vcGlobal &&
        vcContent &&
        issuerDIDAccountGlobal &&
        holderDIDAccountGlobal
      ) {
        setVCIssuing(true);

        const algod = getAlgod(chainType);
        const appIndex = await didvc.createRevokedApp(
          algod,
          issuerDIDAccountGlobal.encryptedSecretKey,
          issuerPw
        );
        const payload: didvc.CredentialJWTPayload<CORVCContent> = {
          sub: holderDIDAccountGlobal.did,
          vc: {
            '@context': [didvc.DEFAULT_CONTEXT],
            type: [didvc.DEFAULT_VC_TYPE],
            credentialSubject: {
              ...vcContent,
              appIndex,
            },
          },
        };

        const vcJWT = await didvc.createCredentialJWT(
          payload,
          issuerDIDAccountGlobal.encryptedSecretKey,
          issuerPw
        );

        const verifiedVC = await didvc.verifyCredentialJWT<CORVCContent>(vcJWT);

        setVCGlobal(vcJWT);
        setIssueTimestamp(Date.now());

        setVCForDisplay(
          JSON.stringify(verifiedVC.verifiableCredential, null, 2)
        );
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vcRequestForDisplay,
    vcForDisplay,
    vcIssued,
    vcIssuing,
    issuerDID: issuerDIDAccount?.did,
    issuerAddress: issuerDIDAccount?.address,
    holderDID: holderDIDAccount?.did,
    holderAddress: holderDIDAccount?.address,
    onIssueVCHandler,
    issueTimestamp,
  };
};

export default useVCIssueMain;
