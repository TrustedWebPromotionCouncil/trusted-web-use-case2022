import { atom } from 'recoil';
import persistAtom from './persistAtom';

const corVCJWTState = atom<string | undefined>({
  key: 'CORVCJWTState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default corVCJWTState;
