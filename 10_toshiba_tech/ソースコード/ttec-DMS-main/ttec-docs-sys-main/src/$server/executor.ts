import { GraphQLExecutor } from 'apollo-server-types'
import { envelop, useSchema } from '@envelop/core'
import { middlewares } from './middlewares'
import { GraphQLSchema } from 'graphql'
import { PrismaClient } from '@prisma/client'
import { GraphQLRequestContext } from 'apollo-server-types'
import { GraphQLContext } from './graphql/context'

type PreContext = GraphQLRequestContext<Record<string, any>>

const getUser = async (prisma: PrismaClient, context: PreContext) => {
    try {
        const userId = context.context.userId as string | undefined

        // next-session にて管理され，api/graphql にて設定されたコンテキスト (ログイン済みの場合は UserID が設定される)
        if (userId) {
            const user = await prisma.user.findFirst({
                where: { id: userId },
            })

            if (user) {
                return user
            }
        }

        return undefined
    } catch (err) {
        // エラーは握りつぶす方向にて
        return undefined
    }
}

export const envelopedExecutor: (
    schema: GraphQLSchema,
    prisma: PrismaClient,
) => GraphQLExecutor<Record<string, any>> | undefined = (schema, prisma) => {
    const getEnveloped = envelop({
        plugins: [
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useSchema(schema),
            ...middlewares,
        ],
    })

    return async (context) => {
        // DB への接続を開始
        await prisma.$connect()

        // コンテキストの設定
        const { execute, contextFactory } = getEnveloped<GraphQLContext>({
            prisma: prisma,
            request: context.request,
            user: await getUser(prisma, context),
        })

        const document = context.document
        const operationName = context.operationName
        const variableValues = context.request.variables
        const contextValue = await contextFactory()

        // GraphQL 処理機能を Envelop で上書きしたものをセット
        return execute({
            schema: schema,
            document: document,
            contextValue: contextValue,
            variableValues: variableValues,
            operationName: operationName,
        })
    }
}
