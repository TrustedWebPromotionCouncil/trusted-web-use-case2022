import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCList } from '../../types';

export const taxVCList2State = atom<VCList | undefined>({
  key: 'TaxVCList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
