import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { ResidentContent } from '../../types';

export const residentInput2State = atom<ResidentContent | undefined>({
  key: 'ResidentInput2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
