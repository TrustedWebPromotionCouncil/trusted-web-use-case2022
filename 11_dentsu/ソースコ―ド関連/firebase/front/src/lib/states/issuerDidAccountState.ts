import { atom } from 'recoil';
import { DidAccount } from '@/lib/algosbt/types';

import persistAtom from './persistAtom';

const issuerDidAccountState = atom<DidAccount | undefined>({
  key: 'IssuerDidAccountState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default issuerDidAccountState;
