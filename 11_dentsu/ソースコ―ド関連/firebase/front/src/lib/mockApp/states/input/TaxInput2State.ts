import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { TaxContent } from '../../types';

export const taxInput2State = atom<TaxContent | undefined>({
  key: 'TaxInput2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
