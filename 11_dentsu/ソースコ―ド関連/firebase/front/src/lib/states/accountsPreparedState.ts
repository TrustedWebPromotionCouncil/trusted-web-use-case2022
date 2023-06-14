import { atom } from 'recoil';
import persistAtom from './persistAtom';

const accountsPreparedState = atom<boolean>({
  key: 'AccountsPreparedState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export default accountsPreparedState;
