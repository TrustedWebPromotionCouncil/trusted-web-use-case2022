import { useEffect, useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import { createDidAccount } from '@/lib/algosbt';

import { holderPw, issuerPw, verifierPw } from '@/lib/algo/account/accounts';

import { getAlgod } from '@/lib/algo/algod/algods';
import getAlgoBalance from '@/lib/algo/api/getAlgoBalance';

import holderDidAccountState from '@/lib/states/holderDidAccountState';
import verifierDidAccountState from '@/lib/states/verifierDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';
import accountsPreparedState from '@/lib/states/accountsPreparedState';
import chainState from '@/lib/states/chainState';

import { DidAccount } from '@/lib/algosbt/types';

const useAccountsMain = () => {
  const [accountsPrepared, setAccountsPrepared] = useState(false);
  const [holderDidAccount, setHolderDidAccount] = useState<DidAccount>();
  const [verifierDidAccount, setVerifierDidAccount] = useState<DidAccount>();
  const [issuerDidAccount, setIssuerDidAccount] = useState<DidAccount>();
  const [timestamp, setTimestamp] = useState(0);

  const [holderDidAccountGlobal, setHolderDidAccountGlobal] = useRecoilState(
    holderDidAccountState
  );
  const [verifierDidAccountGlobal, setVerifierDidAccountGlobal] =
    useRecoilState(verifierDidAccountState);
  const [issuerDidAccountGlobal, setIssuerDidAccountGlobal] = useRecoilState(
    issuerDidAccountState
  );
  const [accountsPreparedGlobal, setAccountsPreparedGlobal] = useRecoilState(
    accountsPreparedState
  );
  const [chainType] = useRecoilState(chainState);

  const errorHandler = useErrorHandler();

  const checkIssuerBalance = useCallback(async () => {
    if (
      !holderDidAccountGlobal ||
      !issuerDidAccountGlobal ||
      !verifierDidAccountGlobal
    ) {
      return;
    }

    const algod = getAlgod(chainType);

    const balance = Number(
      await getAlgoBalance(algod, issuerDidAccountGlobal.address)
    );

    if (balance >= 1000000) {
      setAccountsPreparedGlobal(true);
    }
  }, [
    holderDidAccountGlobal,
    issuerDidAccountGlobal,
    verifierDidAccountGlobal,
    chainType,
    setAccountsPreparedGlobal,
  ]);

  useEffect(() => {
    try {
      setHolderDidAccount(holderDidAccountGlobal);
      setIssuerDidAccount(issuerDidAccountGlobal);
      setVerifierDidAccount(verifierDidAccountGlobal);
      setAccountsPrepared(accountsPreparedGlobal);

      checkIssuerBalance();
    } catch (e) {
      errorHandler(e);
    }
  }, [
    holderDidAccountGlobal,
    issuerDidAccountGlobal,
    verifierDidAccountGlobal,
    accountsPreparedGlobal,
    chainType,
    errorHandler,
    checkIssuerBalance,
  ]);

  const onCreateAccountsHandler = async () => {
    try {
      const holderDidAct = createDidAccount(holderPw);
      const issuerDidAct = createDidAccount(issuerPw);
      const verifierDidAct = createDidAccount(verifierPw);

      setHolderDidAccountGlobal(holderDidAct);
      setIssuerDidAccountGlobal(issuerDidAct);
      setVerifierDidAccountGlobal(verifierDidAct);

      setAccountsPreparedGlobal(false);
    } catch (e) {
      errorHandler(e);
    }
  };

  const onCheckBalanceHandler = async () => {
    try {
      setTimestamp(new Date().getTime());

      await checkIssuerBalance();
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    accountsPrepared,
    holderDidAccount,
    verifierDidAccount,
    issuerDidAccount,
    timestamp,
    onCreateAccountsHandler,
    onCheckBalanceHandler,
  };
};

export default useAccountsMain;
