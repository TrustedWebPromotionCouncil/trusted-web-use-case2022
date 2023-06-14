import { atom } from 'recoil';
import persistAtom from './persistAtom';

const corVPJWTState = atom<string | undefined>({
  key: 'CORVPJWTState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default corVPJWTState;
