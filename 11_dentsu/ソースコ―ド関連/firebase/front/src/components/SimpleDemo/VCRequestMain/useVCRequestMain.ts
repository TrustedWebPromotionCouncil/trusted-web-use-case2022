import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import { createVerifiableMessage } from '@/lib/algosbt';
import { CORVCRequestContent } from '@/lib/types';

import { holderPw } from '@/lib/algo/account/accounts';
import corVCRequestState from '@/lib/states/corVCRequestState';
import holderDidAccountState from '@/lib/states/holderDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';
import { DidAccount } from '@/lib/algosbt/types';

const createCORVCRequestMessage = (
  holderDidAccount: DidAccount,
  issuerDid: string
) => {
  const content: CORVCRequestContent = {
    purpose: '住民票の発行依頼',
    address: '東京都港区',
    name: 'ISID',
  };

  return createVerifiableMessage(
    holderDidAccount,
    issuerDid,
    content,
    holderPw
  );
};

const useVCRequestMain = () => {
  const [vm, setVM] = useState('');
  const [vcRequested, setVCRequested] = useState(false);
  const [holderDidAccount, setHolderDidAccount] = useState<DidAccount>();
  const [issuerDidAccount, setIssuerDidAccount] = useState<DidAccount>();
  const [vcRequestGlobal, setVCRequestGlobal] =
    useRecoilState(corVCRequestState);
  const [holderDidAccountGlobal] = useRecoilState(holderDidAccountState);
  const [issuerDidAccountGlobal] = useRecoilState(issuerDidAccountState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    try {
      setVCRequested(!!vcRequestGlobal);
      setHolderDidAccount(holderDidAccountGlobal);
      setIssuerDidAccount(issuerDidAccountGlobal);

      if (holderDidAccountGlobal && issuerDidAccountGlobal) {
        const vm = createCORVCRequestMessage(
          holderDidAccountGlobal,
          issuerDidAccountGlobal.did
        );

        setVM(JSON.stringify(vm, undefined, 2));
      }
    } catch (e) {
      errorHandler(e);
    }
  }, [
    vcRequestGlobal,
    holderDidAccountGlobal,
    issuerDidAccountGlobal,
    errorHandler,
  ]);

  const onVCRequestClickHandler = () => {
    try {
      if (
        !vcRequestGlobal &&
        holderDidAccountGlobal &&
        issuerDidAccountGlobal
      ) {
        const vm = createCORVCRequestMessage(
          holderDidAccountGlobal,
          issuerDidAccountGlobal.did
        );

        setVCRequestGlobal(vm);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    vm,
    vcRequested,
    holderDidAccount,
    issuerDidAccount,
    onVCRequestClickHandler,
  };
};

export default useVCRequestMain;
