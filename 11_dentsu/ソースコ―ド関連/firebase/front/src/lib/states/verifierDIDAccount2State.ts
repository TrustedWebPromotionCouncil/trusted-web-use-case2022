import { atom } from 'recoil';

import { DIDAccount } from '../types';
import persistAtom from './persistAtom';

const verifierDIDAccount2State = atom<DIDAccount | undefined>({
  key: 'VerifierDIDAccount2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default verifierDIDAccount2State;
