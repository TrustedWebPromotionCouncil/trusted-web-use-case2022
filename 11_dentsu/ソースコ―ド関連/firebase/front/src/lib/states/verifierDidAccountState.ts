import { atom } from 'recoil';
import { DidAccount } from '@/lib/algosbt/types';

import persistAtom from './persistAtom';

const verifierDidAccountState = atom<DidAccount | undefined>({
  key: 'VerifierDidAccountState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default verifierDidAccountState;
