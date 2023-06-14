import { PrismaClient } from '@prisma/client'
import { Config } from '../src/config'
import { fieldEncryptionMiddleware } from 'prisma-field-encryption'

let client: PrismaClient | undefined = undefined

export const prisma = ((): PrismaClient => {
    if (! client) {
        client = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
            datasources: { db: { url: Config.DATABASE_URL } },
        })
    }

    return client
})()

// フィールドレベル暗号化
prisma.$use(
    fieldEncryptionMiddleware({
        encryptionKey: Config.PRISMA_FIELD_ENCRYPTION_KEY,
    }),
)