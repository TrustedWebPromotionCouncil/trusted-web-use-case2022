import { Document } from '@prisma/client'
import { GraphQLContext } from '../graphql/context'

export class DocumentService {
    /**
     * すべての文書を返却します
     * 
     * @param context 
     * @param params 
     * @returns 
     */
    static async findAll(
        context: GraphQLContext,
        params: {}
    ) {
        if (! context.user) {
            throw new Error()
        }

        return await context.prisma.document.findMany({
            orderBy: {
                scanedAt: 'desc',
            },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                location: true,
                filename: true,
                scanedAt: true,
            }
        })
    }

    /**
     * 特定の文書を返却します
     * 
     * @param context 
     * @param params 
     * @returns 
     */
    static async findOne(
        context: GraphQLContext,
        params: {
            documentId: string,
        },
    ): Promise<Document> {
        if (! context.user) {
            throw new Error()
        }

        return await context.prisma.document.findFirstOrThrow({
            where: { id: params.documentId },
        })
    }

    static async removeOne(
        context: GraphQLContext,
        params: {
            documentId: string,
        }
    ): Promise<string> {
        if (! context.user) {
            throw new Error()
        }

        const document = await context.prisma.document.findFirstOrThrow({
            where: { id: params.documentId }
        })
        await context.prisma.document.delete({
            where: { id: document.id }
        })

        return document.id
    }
}
