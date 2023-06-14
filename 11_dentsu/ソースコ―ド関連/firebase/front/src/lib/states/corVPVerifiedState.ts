import { atom } from 'recoil';
import persistAtom from './persistAtom';

const corVPVerifiedState = atom<boolean>({
  key: 'CORVPVerifiedState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export default corVPVerifiedState;
