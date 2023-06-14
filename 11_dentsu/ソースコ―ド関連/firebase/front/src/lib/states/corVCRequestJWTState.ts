import { atom } from 'recoil';
import persistAtom from './persistAtom';

const corVCRequestJWTState = atom<string | undefined>({
  key: 'CORVCRequestJWTState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default corVCRequestJWTState;
