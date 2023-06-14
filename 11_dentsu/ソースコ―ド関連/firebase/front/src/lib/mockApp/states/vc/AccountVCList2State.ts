import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCList } from '../../types';

export const accountVCList2State = atom<VCList | undefined>({
  key: 'AccountVCList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
