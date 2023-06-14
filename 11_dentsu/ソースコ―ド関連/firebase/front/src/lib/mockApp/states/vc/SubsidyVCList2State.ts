import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCList } from '../../types';

export const subsidyVCList2State = atom<VCList | undefined>({
  key: 'SubsidyVCList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
