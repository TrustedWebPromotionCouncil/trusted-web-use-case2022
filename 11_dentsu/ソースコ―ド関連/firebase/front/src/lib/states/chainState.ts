import { atom } from 'recoil';
import { ChainType } from '@/lib/types';

import persistAtom from './persistAtom';

const chainState = atom<ChainType>({
  key: 'ChainState',
  default: ChainType.TestNet,
  effects_UNSTABLE: [persistAtom],
});

export default chainState;
