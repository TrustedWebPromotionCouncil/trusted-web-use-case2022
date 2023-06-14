import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import { getIndexer } from '@/lib/algo/indexer/indexers';
import { getAlgod } from '@/lib/algo/algod/algods';

import chainState from '@/lib/states/chainState';
import accountsPreparedState from '@/lib/states/accountsPreparedState';
import corVCRequestState from '@/lib/states/corVCRequestState';
import corVCState from '@/lib/states/corVCState';
import corVPState from '@/lib/states/corVPState';
import corVPVerifiedState from '@/lib/states/corVPVerifiedState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';

import * as cryptUtils from '@/lib/algosbt/utils/cryptUtils';

import deleteAllApps from '@/lib/algo/api/deleteAllApps';
import { issuerPw } from '@/lib/algo/account/accounts';

const useMain = () => {
  const [accountsPrepared, setAccountsPrepared] = useState(false);
  const [vcRequested, setVCRequested] = useState(false);
  const [vcIssued, setVCIssued] = useState(false);
  const [vpSubmitted, setVPSubmitted] = useState(false);
  const [vpVerified, setVPVerified] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [accountsPreparedGlobal] = useRecoilState(accountsPreparedState);
  const [vcRequestGlobal, setVCRequestGlobal] =
    useRecoilState(corVCRequestState);
  const [vcGlobal, setVCGlobal] = useRecoilState(corVCState);
  const [vpGlobal, setVPGlobal] = useRecoilState(corVPState);
  const [vpVerifiedGlobal, setVPVerifiedGlobal] =
    useRecoilState(corVPVerifiedState);
  const [issuerDidAccount] = useRecoilState(issuerDidAccountState);
  const [chainType] = useRecoilState(chainState);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    setAccountsPrepared(accountsPreparedGlobal);
    setVCRequested(!!vcRequestGlobal);
    setVCIssued(!!vcGlobal);
    setVPSubmitted(!!vpGlobal);
    setVPVerified(vpVerifiedGlobal);
  }, [
    accountsPreparedGlobal,
    vcRequestGlobal,
    vcGlobal,
    vpGlobal,
    vpVerifiedGlobal,
  ]);

  const onClearClickHandler = () => {
    setVCRequestGlobal(undefined);
    setVCGlobal(undefined);
    setVPGlobal(undefined);
    setVPVerifiedGlobal(false);

    if (clearing) {
      return;
    }

    if (!issuerDidAccount) {
      return;
    }

    const func = async () => {
      setClearing(true);

      const indexer = getIndexer(chainType);
      const algod = getAlgod(chainType);

      const sk = cryptUtils.decryptByPassword(
        Buffer.from(issuerDidAccount.encSecretKey, 'base64'),
        issuerPw
      );

      await deleteAllApps(indexer, algod, sk);

      setClearing(false);
    };

    func().catch(errorHandler);
  };

  (async () => {
    //await tryDidjwt();
  })();
  console.log(vpVerified);

  return {
    accountsPrepared,
    vcRequested,
    vcIssued,
    vpSubmitted,
    vpVerified,
    clearing,
    onClearClickHandler,
  };
};

export default useMain;
