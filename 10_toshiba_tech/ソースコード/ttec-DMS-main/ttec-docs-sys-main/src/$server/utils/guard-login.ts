import { GetServerSideProps } from 'next'
import { prisma } from '../../../prisma/client'
import { getSession } from './session'

export interface LoginContext {}

export const guardLogin: GetServerSideProps<LoginContext> = async ({ req, res }) => {
    const session = await getSession(req, res)

    // セッションがない場合はログイン画面を表示
    if (! session.userId) {
        return {
            props: {},
        }
    }

    // ユーザー存在確認
    const user = await prisma.user.findFirst({
        where: { id: session.userId },
    })

    // ユーザーが存在しない場合はログイン画面を表示
    if (! user) {
        return {
            props: {},
        }
    }

    return {
        redirect: {
            destination: `/items`,
            permanent: false,
        },
    }
}
