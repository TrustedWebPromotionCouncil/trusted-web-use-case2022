import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { SubsidyContent } from '../../types';

export const subsidyInput2State = atom<SubsidyContent | undefined>({
  key: 'SubsidyInput2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
