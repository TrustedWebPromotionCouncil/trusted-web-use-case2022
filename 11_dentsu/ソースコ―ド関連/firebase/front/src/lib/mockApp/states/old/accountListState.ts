import { atom } from 'recoil';

import { AccountInputFormType } from '@/lib/mockApp/types/old/inputForm';
import persistAtom from '@/lib/states/persistAtom';

export const accountListState = atom<AccountInputFormType[] | undefined>({
  key: 'AccountListState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
