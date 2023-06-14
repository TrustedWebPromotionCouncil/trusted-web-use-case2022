import { atom } from 'recoil';
import { DidAccount } from '@/lib/algosbt/types';

import persistAtom from './persistAtom';

const holderDidAccountState = atom<DidAccount | undefined>({
  key: 'HolderDidAccountState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default holderDidAccountState;
