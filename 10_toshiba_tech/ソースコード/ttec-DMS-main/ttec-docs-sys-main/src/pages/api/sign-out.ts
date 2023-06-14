import { StatusCodes } from 'http-status-codes'
import { NextApiHandler } from 'next'
import { getSession } from '../../$server/utils/session'

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(StatusCodes.BAD_REQUEST).end()
        return
    }

    const session = await getSession(req, res)

    // セッションが存在しない場合はエラー
    if (!session.userId) {
        res.status(StatusCodes.UNAUTHORIZED).end()
    }

    // セッションを破棄
    await session.destroy()

    res.status(StatusCodes.OK).json({ url: `${ req.url }` })
}

export default handler
