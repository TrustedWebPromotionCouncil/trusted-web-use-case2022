import { atom } from 'recoil';

import { ResidentInputFormType } from '@/lib/mockApp/types/old/inputForm';
import persistAtom from '@/lib/states/persistAtom';

export const residentListState = atom<ResidentInputFormType[] | undefined>({
  key: 'ResidentListState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
