import { GraphQLRequest } from 'apollo-server-types/dist/index'
import { PrismaClient, User } from '@prisma/client'

export interface GraphQLContext {
    // リクエストオブジェクト
    request: GraphQLRequest

    // Prisma クライアントオブジェクト
    prisma: PrismaClient

    // 認証済みの場合は User オブジェクトが設定される
    user?:
        | User
        | null
}
