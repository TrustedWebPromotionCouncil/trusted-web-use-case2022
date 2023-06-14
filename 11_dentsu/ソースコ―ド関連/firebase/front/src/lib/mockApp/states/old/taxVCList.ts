import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';
import { TaxVCType } from '@/lib/mockApp/types/old';

export const taxVCListState = atom<TaxVCType[] | undefined>({
    key: 'taxVCListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
