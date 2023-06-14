import { GetServerSideProps } from 'next'
import { prisma } from '../../../prisma/client'
import { IDENT_RETURN_TO } from '../../pages/sign-in'
import { getSession } from './session'

export interface LoginContext {}

export const enforceLogin: GetServerSideProps<LoginContext> = async ({ req, res }) => {
    const session = await getSession(req, res)

    // 未認証の場合: サインインページへ
    if (!session.userId) {
        await session.destroy()

        return {
            redirect: {
                destination: `/sign-in?${ IDENT_RETURN_TO }=${ req.url }`,
                permanent: false,
            },
        }
    }

    // ユーザー存在確認
    const user = await prisma.user.findFirst({
        where: { id: session.userId },
    })

    // ユーザーが存在しない場合: サインインページへ
    if (!user) {
        await session.destroy()

        return {
            redirect: {
                destination: `/sign-in?${ IDENT_RETURN_TO }=${ req.url }`,
                permanent: false,
            },
        }
    }

    return {
        props: {},
    }
}
