import axios from 'axios'
import { useRecoilState } from 'recoil'
import { userState } from '../atoms/user'
import { print } from 'graphql/language/printer'
import { GetUserDocument, GetUserQuery } from '../graphql/client'

export const useUser = () => {
    const [ user, setUser ] = useRecoilState(userState)

    /**
     * GraphQL を利用してユーザー情報を取得・返却する
     *
     * MEMO: 最初は Apollo Client を利用して `useUser()` フックの中で処理をしていたけれども、何度かリクエストを
     * 送るうちに Promise がスタックするようになってしまって (原因不明) Axios を使って直接 GraphQL Query を発行
     * するように変更しています。React フックの中で Apollo Client を利用することの相性が悪いのだと思います。
     */
    const fetchUser = async (): Promise<GetUserQuery['user']> => {
        const ret = await axios.post<{ data?: { user?: GetUserQuery['user'] } }>('/api/graphql', {
            query: print(GetUserDocument),
        })

        // GraphQL クライアントではないので NULL チェック
        if (!ret.data.data || !ret.data.data.user) {
            throw new Error()
        }

        return ret.data.data.user
    }

    /**
     * サインイン & ユーザーステート (ユーザー情報) 設定処理
     *
     * @param email
     * @param password
     */
    const signIn = async (email: string, password: string): Promise<GetUserQuery['user']> => {
        await axios.post('/api/sign-in', {
            email,
            password,
        })

        // ユーザー情報を取得
        const user = await fetchUser()

        // ステート: ユーザー情報を設定
        setUser(user)

        // ユーザー情報を返却
        return user
    }

    /**
     * サインアウト & ユーザーステートクリア処理
     */
    const signOut = async () => {
        await axios.get('/api/sign-out')

        // ステート: クリア
        setUser(undefined)
    }

    /**
     * ユーザーステート最新化処理
     *
     * @returns
     */
    const refresh = async (): Promise<GetUserQuery['user']> => {
        // ユーザー情報を取得
        const user = await fetchUser()

        // ステート: ユーザー情報を設定
        setUser(user)

        // ユーザー情報を返却
        return user
    }

    return {
        user,
        signIn,
        signOut,
        refresh,
    }
}
