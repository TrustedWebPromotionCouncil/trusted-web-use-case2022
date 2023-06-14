import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';
import { SubsidyVCType } from '@/lib/mockApp/types/old';

export const subsidyVCListState = atom<SubsidyVCType[] | undefined>({
    key: 'subsidyVCListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
