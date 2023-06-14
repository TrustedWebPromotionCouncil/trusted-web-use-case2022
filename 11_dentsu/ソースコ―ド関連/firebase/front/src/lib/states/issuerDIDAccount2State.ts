import { atom } from 'recoil';

import { DIDAccount } from '../types';
import persistAtom from './persistAtom';

const issuerDIDAccount2State = atom<DIDAccount | undefined>({
  key: 'IssuerDIDAccount2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default issuerDIDAccount2State;
