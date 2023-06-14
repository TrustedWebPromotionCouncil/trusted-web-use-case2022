import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';
import { ResidentVCType } from '@/lib/mockApp/types/old';

export const residentVCListState = atom<ResidentVCType[] | undefined>({
    key: 'residentVCListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
