import { atom } from 'recoil';

import { AccountInputFormType } from '@/lib/mockApp/types/old/inputForm';
import persistAtom from '@/lib/states/persistAtom';

export const accountInputState = atom<AccountInputFormType | undefined>({
  key: 'AccountInputState',
  default: {
    id: 0,
    bankCode: '',
    branchNumber: '',
    accountNumber: '',
    corporateName: '',
    applicantName: '',
    applicantAddress: '',
    applicationDate: undefined,
    verifyStatus: undefined,
    approvalStatus: undefined,
  },
  effects_UNSTABLE: [persistAtom],
});
