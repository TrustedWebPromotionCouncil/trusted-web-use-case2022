import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';
import { SubsidyVCRequestType } from '@/lib/mockApp/types/old';

export const subsidyVCRequestListState = atom<SubsidyVCRequestType[] | undefined>({
    key: 'subsidyVCRequestListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
