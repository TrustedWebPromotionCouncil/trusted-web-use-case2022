import { atom } from 'recoil';
import persistAtom from '@/lib/states/persistAtom';
import { AccountVCType } from '@/lib/mockApp/types/old';

export const accountVCListState = atom<AccountVCType[] | undefined>({
    key: 'accountVCListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
