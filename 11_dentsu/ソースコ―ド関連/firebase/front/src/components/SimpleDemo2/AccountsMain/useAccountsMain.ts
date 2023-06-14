import { useEffect, useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { useErrorHandler } from 'react-error-boundary';

import { holderPw, issuerPw, verifierPw } from '@/lib/algo/account/accounts';
import { DIDAccount } from '@/lib/types';

import { getAlgod } from '@/lib/algo/algod/algods';
import getAlgoBalance from '@/lib/algo/api/getAlgoBalance';

import holderDIDAccountState from '@/lib/states/holderDIDAccount2State';
import verifierDIDAccountState from '@/lib/states/verifierDIDAccount2State';
import issuerDIDAccountState from '@/lib/states/issuerDIDAccount2State';
import accountsPreparedState from '@/lib/states/accountsPreparedState';
import chainState from '@/lib/states/chainState';

import * as didvc from '@/lib/didvc';

const useAccountsMain = () => {
  const [accountsPrepared, setAccountsPrepared] = useState(false);
  const [holderDIDAccount, setHolderDIDAccount] = useState<DIDAccount>();
  const [verifierDIDAccount, setVerifierDIDAccount] = useState<DIDAccount>();
  const [issuerDIDAccount, setIssuerDIDAccount] = useState<DIDAccount>();
  const [timestamp, setTimestamp] = useState(0);

  const [holderDIDAccountGlobal, setHolderDIDAccountGlobal] = useRecoilState(
    holderDIDAccountState
  );
  const [verifierDIDAccountGlobal, setVerifierDIDAccountGlobal] =
    useRecoilState(verifierDIDAccountState);
  const [issuerDIDAccountGlobal, setIssuerDIDAccountGlobal] = useRecoilState(
    issuerDIDAccountState
  );
  const [accountsPreparedGlobal, setAccountsPreparedGlobal] = useRecoilState(
    accountsPreparedState
  );
  const [chainType] = useRecoilState(chainState);

  const errorHandler = useErrorHandler();

  const checkIssuerBalance = useCallback(async () => {
    if (
      !holderDIDAccountGlobal ||
      !issuerDIDAccountGlobal ||
      !verifierDIDAccountGlobal
    ) {
      setAccountsPreparedGlobal(false);
      return;
    }

    const algod = getAlgod(chainType);

    const balance = Number(
      await getAlgoBalance(algod, issuerDIDAccountGlobal.address)
    );

    if (balance >= 1000000) {
      setAccountsPreparedGlobal(true);
    } else {
      setAccountsPreparedGlobal(false);
    }
  }, [
    holderDIDAccountGlobal,
    issuerDIDAccountGlobal,
    verifierDIDAccountGlobal,
    chainType,
    setAccountsPreparedGlobal,
  ]);

  useEffect(() => {
    try {
      setHolderDIDAccount(holderDIDAccountGlobal);
      setIssuerDIDAccount(issuerDIDAccountGlobal);
      setVerifierDIDAccount(verifierDIDAccountGlobal);
      setAccountsPrepared(accountsPreparedGlobal);

      checkIssuerBalance();
    } catch (e) {
      errorHandler(e);
    }
  }, [
    holderDIDAccountGlobal,
    issuerDIDAccountGlobal,
    verifierDIDAccountGlobal,
    accountsPreparedGlobal,
    chainType,
    errorHandler,
    checkIssuerBalance,
  ]);

  const onCreateAccountsHandler = async () => {
    try {
      const holderDIDAccount = didvc.createDIDAccount(holderPw);
      const issuerDIDAccount = didvc.createDIDAccount(issuerPw);
      const verifierDIDAccount = didvc.createDIDAccount(verifierPw);

      setHolderDIDAccountGlobal(holderDIDAccount);
      setIssuerDIDAccountGlobal(issuerDIDAccount);
      setVerifierDIDAccountGlobal(verifierDIDAccount);

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
    holderDID: holderDIDAccount?.did,
    holderAddress: holderDIDAccount?.address,
    issuerDID: issuerDIDAccount?.did,
    issuerAddress: issuerDIDAccount?.address,
    verifierDID: verifierDIDAccount?.did,
    verifierAddress: verifierDIDAccount?.address,
    timestamp,
    onCreateAccountsHandler,
    onCheckBalanceHandler,
  };
};

export default useAccountsMain;
