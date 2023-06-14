import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';
import { AccountVCRequestType } from '@/lib/mockApp/types/old';

export const accountVCRequestListState = atom<AccountVCRequestType[] | undefined>({
    key: 'accountVCRequestListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
