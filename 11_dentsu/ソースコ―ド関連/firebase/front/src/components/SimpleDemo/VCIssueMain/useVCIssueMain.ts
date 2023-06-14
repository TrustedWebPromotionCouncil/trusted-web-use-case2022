import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import { getAlgod } from '@/lib/algo/algod/algods';

import { DidAccount } from '@/lib/algosbt/types';

import chainState from '@/lib/states/chainState';
import corVCState from '@/lib/states/corVCState';
import corVCRequestState from '@/lib/states/corVCRequestState';
import holderDidAccountState from '@/lib/states/holderDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';
import {
  createVerifiableCredential,
  verifyVerifiableMessage,
} from '@/lib/algosbt';
import { CORVCContent, CORVCRequestContent } from '@/lib/types';

import { issuerPw } from '@/lib/algo/account/accounts';

const createVCContent = (vcRequestContent: CORVCRequestContent) => {
  const content: CORVCContent = {
    address: vcRequestContent.address,
    name: vcRequestContent.name,
  };

  return content;
};

const useVCIssueMain = () => {
  const [vcRequestVerified, setVCRequestVerified] = useState(false);
  const [vcIssued, setVCIssued] = useState(false);
  const [vcIssuing, setVCIssuing] = useState(false);
  const [vcRequestForDisplay, setVCRequestForDisplay] = useState('');
  const [vcContent, setVCContent] = useState<CORVCContent>();
  const [vcBeforeIssuingForDisplay, setVCBeforeIssuingForDisplay] =
    useState('');
  const [vcAfterIssuingForDisplay, setVCAfterIssuingForDisplay] = useState('');

  const [issueTimestamp, setIssueTimestamp] = useState(0);
  const [holderDidAccount, setHolderDidAccount] = useState<DidAccount>();
  const [issuerDidAccount, setIssuerDidAccount] = useState<DidAccount>();

  const [chainType] = useRecoilState(chainState);
  const [vcRequestGlobal] = useRecoilState(corVCRequestState);
  const [vcGlobal, setVCGlobal] = useRecoilState(corVCState);
  const [holderDidAccountGlobal] = useRecoilState(holderDidAccountState);
  const [issuerDidAccountGlobal] = useRecoilState(issuerDidAccountState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVCIssued(!!vcGlobal);
      setHolderDidAccount(holderDidAccountGlobal);
      setIssuerDidAccount(issuerDidAccountGlobal);

      if (vcIssuing && !!vcGlobal) {
        setVCIssuing(false);
      }

      if (vcRequestGlobal && !vcRequestForDisplay) {
        setVCRequestForDisplay(JSON.stringify(vcRequestGlobal, undefined, 2));
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vcGlobal,
    vcRequestGlobal,
    vcIssuing,
    vcRequestForDisplay,
    issuerDidAccountGlobal,
    holderDidAccountGlobal,
    errorHandler,
  ]);

  const onVerifyVCRequestHandler = () => {
    try {
      if (vcRequestGlobal) {
        const verified = verifyVerifiableMessage(vcRequestGlobal);

        setVCRequestVerified(verified);

        if (verified) {
          const content = createVCContent(vcRequestGlobal.message.content);

          setVCContent(content);
          setVCBeforeIssuingForDisplay(JSON.stringify(content, null, 2));
        }
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const onIssueVCHandler = async () => {
    try {
      if (
        vcRequestGlobal &&
        !vcGlobal &&
        vcContent &&
        issuerDidAccountGlobal &&
        holderDidAccountGlobal
      ) {
        setVCIssuing(true);

        const algod = getAlgod(chainType);
        const vc = await createVerifiableCredential(
          algod,
          issuerDidAccountGlobal,
          holderDidAccountGlobal.did,
          vcContent,
          issuerPw
        );

        setVCGlobal(vc);
        setIssueTimestamp(new Date().getTime());
        setVCAfterIssuingForDisplay(JSON.stringify(vc, null, 2));
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vcRequestForDisplay,
    vcRequestVerified,
    vcBeforeIssuingForDisplay,
    vcAfterIssuingForDisplay,
    vcIssued,
    vcIssuing,
    issuerDidAccount,
    holderDidAccount,
    issueTimestamp,
    onVerifyVCRequestHandler,
    onIssueVCHandler,
  };
};

export default useVCIssueMain;
