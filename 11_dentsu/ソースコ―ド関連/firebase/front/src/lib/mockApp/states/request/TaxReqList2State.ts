import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCReqList } from '../../types';

export const taxReqList2State = atom<VCReqList | undefined>({
  key: 'TaxReqList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
