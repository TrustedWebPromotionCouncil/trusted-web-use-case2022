import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCList } from '../../types';

export const residentVCList2State = atom<VCList | undefined>({
  key: 'ResidentVCList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
