import { StatusCodes } from 'http-status-codes'
import { NextApiHandler } from 'next'
import { prisma } from '../../../prisma/client'
import { getSession } from '../../$server/utils/session'
import { UserService } from '../../$server/services/user'

interface T {
    email?: string
    password?: string
}

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(StatusCodes.BAD_REQUEST).end()
        return
    }

    const body = req.body as T

    if (!body.email || !body.password) {
        res.status(StatusCodes.BAD_REQUEST).end()
        return
    }

    // メールアドレスをキーにユーザーを特定
    const user = await prisma.user.findFirstOrThrow({
        where: { email: body.email },
    })

    // パスワードの検証
    const verifiedUser = await UserService.signIn({
        prisma: prisma,
        request: {},
        user: user,
    }, {
        password: body.password,
    })

    const session = await getSession(req, res)

    // セッションに保存
    session.userId = verifiedUser.id

    res.status(StatusCodes.OK).json({ url: `${ req.url }` })
}

export default handler
