import { atom } from 'recoil';

import { SubsidyInputFormType } from '@/lib/mockApp/types/old/Form';
import persistAtom from '@/lib/states/persistAtom';

export const subsidyInputState = atom<SubsidyInputFormType | undefined>({
    key: 'subsidyInputState',
    default: {
        id: 0,
        residentVC: "0",
        accountVC: "0",
        taxVC: "0",
        fullName: "",
        address: "",
        applicationDate: "",
        verifyStatus: false,
        approvalStatus: false,
        residentVP: undefined,
        accountVP: undefined,
        taxVP: undefined
    },
    effects_UNSTABLE: [persistAtom],
});
