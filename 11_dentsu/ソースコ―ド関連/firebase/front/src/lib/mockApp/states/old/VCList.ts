import { atom } from 'recoil';

import { VCListType } from '@/lib/mockApp/types/old/Form';
import persistAtom from '@/lib/states/persistAtom';

export const VCListState = atom<VCListType | undefined>({
    key: 'VCListState',
    default: {
        resident: [],
        account: [],
        tax: [],
        subsidy:[]
    },
    effects_UNSTABLE: [persistAtom],
});
