import nextSession from 'next-session'
import { Config } from '../../config'
import { promisifyStore } from 'next-session/lib/compat'
import session from 'express-session'
import RedisStoreFactory from 'connect-redis'
import Redis from 'ioredis'

const RedisStore = RedisStoreFactory(session)

const secure = (): boolean => {
    if (Config.IN_PRODUCTION) {
        return true
    } else {
        return false
    }
}

interface T {
    userId?: string
}

export const getSession = nextSession<T>({
    autoCommit: true,
    cookie: {
        httpOnly: true,
        secure: secure(),
        sameSite: 'strict',
    },
    store: promisifyStore(
        new RedisStore({
            client: new Redis(Config.REDIS_URL),
        }),
    ),
})
