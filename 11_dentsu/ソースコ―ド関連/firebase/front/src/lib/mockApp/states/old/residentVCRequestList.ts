import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { ResidentVCRequestType } from '@/lib/mockApp/types/old';

export const residentVCRequestListState = atom<ResidentVCRequestType[] | undefined>({
    key: 'residentVCRequestListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
