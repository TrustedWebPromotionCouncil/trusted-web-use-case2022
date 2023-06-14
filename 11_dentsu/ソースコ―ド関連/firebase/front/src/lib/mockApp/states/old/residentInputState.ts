import { atom } from 'recoil';

import { ResidentInputFormType } from '@/lib/mockApp/types/old/inputForm';
import persistAtom from '@/lib/states/persistAtom';

export const residentInputState = atom<ResidentInputFormType | undefined>({
  key: 'ResidentInputState',
  default: {
    id: 0,
    fullName: '',
    fullNameFurigana: '',
    address: '',
    addressRegistDate: '',
    addressRegistYear: '',
    addressRegistMonth: '',
    permanentAddress: '',
    applicationDate: undefined,
    verifyStatus: undefined,
    approvalStatus: undefined,
  },
  effects_UNSTABLE: [persistAtom],
});
