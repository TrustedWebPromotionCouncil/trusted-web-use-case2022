import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { VCReqList } from '../../types';

export const accountReqList2State = atom<VCReqList | undefined>({
  key: 'AccountReqList2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
