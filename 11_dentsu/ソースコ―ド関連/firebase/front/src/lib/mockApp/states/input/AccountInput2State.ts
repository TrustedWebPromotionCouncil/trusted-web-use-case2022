import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { AccountContent } from '../../types';

export const accountInput2State = atom<AccountContent | undefined>({
  key: 'AccountInput2State',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
