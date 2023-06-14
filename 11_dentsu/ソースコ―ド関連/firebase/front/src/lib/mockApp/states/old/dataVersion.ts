import { atom } from 'recoil';

import persistAtom from '@/lib/states/persistAtom';

export const dataVerState = atom<number | undefined>({
    key: 'dataVerState',
    default: 0,
    effects_UNSTABLE: [persistAtom],
});
