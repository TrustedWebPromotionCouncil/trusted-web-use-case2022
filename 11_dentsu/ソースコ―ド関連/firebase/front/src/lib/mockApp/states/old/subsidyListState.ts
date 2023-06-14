import { atom } from 'recoil';

import { SubsidyInputFormType } from '@/lib/mockApp/types/old/Form';
import persistAtom from '@/lib/states/persistAtom';

export const subsidyListState = atom<SubsidyInputFormType[] | undefined>({
  key: 'subsidyListState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
