import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import { getAlgod } from '@/lib/algo/algod/algods';
import getAlgoBlance from '@/lib/algo/api/getAlgoBalance';
import * as didUtils from '@/lib/algosbt/utils/didUtils';
import chainState from '@/lib/states/chainState';
import formatBigint from '@/lib/utils/formatBigint';
import { DidAccount } from '@/lib/algosbt/types';

export type UseDidInfoParams = {
  name: string;
  didAccount?: DidAccount;
  timestamp?: number;
};

const useDidInfo = ({ name, didAccount, timestamp }: UseDidInfoParams) => {
  const chainType = useRecoilValue(chainState);
  const [balance, setBalance] = useState('');
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (!didAccount) {
      return;
    }

    const func = async () => {
      const algod = getAlgod(chainType);

      const balance = await getAlgoBlance(algod, didAccount.address);

      setBalance(formatBigint(balance));
    };

    func().catch(errorHandler);
  }, [didAccount, errorHandler, chainType, timestamp]);

  return {
    name,
    did: didAccount ? didUtils.shortenDid(didAccount.did) : '',
    balance,
  };
};

export default useDidInfo;
