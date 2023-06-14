import { StatusCodes } from 'http-status-codes'
import { NextApiHandler } from 'next'
import { prisma } from '../../../prisma/client'
import Redis from 'ioredis'
import { Config } from '../../config'

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(StatusCodes.BAD_REQUEST).end()
        return
    }

    try {
        const client = new Redis(Config.REDIS_URL)

        // DB 接続確認
        const db = await prisma.$queryRaw<Array<string>>`SELECT NOW()`

        const redis = await client.ping()

        res.status(StatusCodes.OK).json({ db: db, redis: redis })

        client.disconnect()
        await prisma.$disconnect()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    }
}

export default handler
