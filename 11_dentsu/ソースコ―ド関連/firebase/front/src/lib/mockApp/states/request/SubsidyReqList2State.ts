import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCReqList } from '../../types';

export const subsidyReqList2State = atom<VCReqList | undefined>({
  key: 'SubsidyReqList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
