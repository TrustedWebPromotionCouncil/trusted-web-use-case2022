import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCReqList } from '../../types';

export const residentReqList2State = atom<VCReqList | undefined>({
  key: 'ResidentReqList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
