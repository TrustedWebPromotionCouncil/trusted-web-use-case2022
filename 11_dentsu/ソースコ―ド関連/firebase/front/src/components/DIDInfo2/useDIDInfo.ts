import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import { getAlgod } from '@/lib/algo/algod/algods';
import getAlgoBlance from '@/lib/algo/api/getAlgoBalance';
import chainState from '@/lib/states/chainState';
import formatBigint from '@/lib/utils/formatBigint';

export type UseDIDInfoParams = {
  name: string;
  did?: string;
  address?: string;
  timestamp?: number;
};

const useDIDInfo = ({ name, did, address, timestamp }: UseDIDInfoParams) => {
  const chainType = useRecoilValue(chainState);
  const [balance, setBalance] = useState('');
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (!did || !address) {
      return;
    }

    const func = async () => {
      const algod = getAlgod(chainType);

      const balance = await getAlgoBlance(algod, address);

      setBalance(formatBigint(balance));
    };

    func().catch(errorHandler);
  }, [did, address, errorHandler, chainType, timestamp]);

  return {
    name,
    did: did || '',
    balance,
  };
};

export default useDIDInfo;
