import { atom } from 'recoil';

import { DIDAccount } from '../types';
import persistAtom from './persistAtom';

const holderDIDAccount2State = atom<DIDAccount | undefined>({
  key: 'HolderDIDAccount2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default holderDIDAccount2State;
