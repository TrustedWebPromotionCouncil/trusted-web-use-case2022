import { NextApiHandler } from 'next'
import { server } from '../../$server'
import { getSession } from '../../$server/utils/session'

const startServer = server.start()

const handler: NextApiHandler = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    // res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-authorization-token, x-patient-authorization-token',
    )
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    if (req.method === 'OPTIONS') {
        res.end()
        return
    }

    const session = await getSession(req, res)

    // セッションにユーザー ID が存在する場合
    if (session.userId) {
        server.requestOptions = {
            ...server.requestOptions,
            context: {
                userId: session.userId,
            },
        }
    }

    await startServer
    await server.createHandler({
        path: '/api/graphql',
    })(req, res)
}

export default handler

export const config = {
    api: {
        responseLimit: false,
        bodyParser: false,
        sizeLimit: '256mb',
    },
}
