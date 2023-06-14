import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { GetUserQuery } from '../graphql/client'

type T = GetUserQuery['user'] | undefined

const { persistAtom } = recoilPersist({
    key: 'recoil-persist',
    storage: typeof window === 'undefined' ? undefined : localStorage,
})

export const userState = atom<T>({
    key: 'user',
    default: undefined,
    effects: [ persistAtom ],
})
