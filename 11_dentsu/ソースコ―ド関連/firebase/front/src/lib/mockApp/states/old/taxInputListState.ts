import { atom } from 'recoil';

import { TaxInputFormType } from '@/lib/mockApp/types/old/Form';
import persistAtom from '@/lib/states/persistAtom';

export const taxInputListState = atom<TaxInputFormType[] | undefined>({
    key: 'taxInputListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
