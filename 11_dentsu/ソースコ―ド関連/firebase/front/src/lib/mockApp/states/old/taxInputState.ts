import { atom } from 'recoil';

import { TaxInputFormType } from '@/lib/mockApp/types/old/Form';
import persistAtom from '@/lib/states/persistAtom';

export const taxInputState = atom<TaxInputFormType | undefined>({
    key: 'taxInputState',
    default: {
        id: 0,
        applicationYear: "", 
        corporationName: "", 
        corporationAddress: "", 
        fullName: "",
        address: "",
        applicationDate: "", 
        verifyStatus: false, 
        approvalStatus: false, 
    },
    effects_UNSTABLE: [persistAtom],
});
