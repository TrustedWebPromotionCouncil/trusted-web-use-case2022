import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';
import { TaxVCRequestType } from '@/lib/mockApp/types/old';

export const taxVCRequestListState = atom<TaxVCRequestType[] | undefined>({
    key: 'taxVCRequestListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
