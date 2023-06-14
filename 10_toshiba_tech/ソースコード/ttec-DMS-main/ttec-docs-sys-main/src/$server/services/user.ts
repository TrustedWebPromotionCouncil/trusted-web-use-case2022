import { User } from '@prisma/client'
import { AUthNUtil } from '../../$server/utils/authn'
import { GraphQLContext } from '../graphql/context'

export class UserService {
    /**
     * ユーザーのサインイン処理を行います
     *
     * @param context 
     * @param params 
     * @returns 
     */
    static async signIn(
        context: GraphQLContext,
        params: {
            password: string
        },
    ): Promise<User> {
        const user = context.user

        if (! user) {
            throw new Error()
        }

        // パスワードが設定されていない場合はエラー (※パスワード設定前が該当する)
        if (! user.password) {
            throw new Error()
        }

        // パスワード検証
        const verified = await AUthNUtil.verify({
            hash: user.password,
            password: params.password,
        })

        // 認証失敗の場合はエラー
        if (! verified) {
            throw new Error()
        }

        return user
    }

    /**
     * ユーザー情報を返却します
     *
     * @param context 
     * @param params 
     * @returns 
     */
    static async user(
        context: GraphQLContext,
        params: {},
    ): Promise<User> {
        const user = context.user

        if (! user) {
            throw new Error()
        }

        return await context.prisma.user.findFirstOrThrow({
            where: { id: user.id },
        })
    }

    /**
     * ユーザーを追加します
     * 
     * @param context 
     * @param params 
     * @returns 
     */
    static async addUser(
        context: GraphQLContext,
        params: {
            email: string,
            password: string,
        },
    ): Promise<User> {
        const user = context.user

        if (! user) {
            throw new Error()
        }

        return await context.prisma.user.create({
            data: {
                email: params.email,
                password: await AUthNUtil.hash({ password: params.password }),
            },
        })
    }

    /**
     * ユーザーのパスワードをリセットします
     * 
     * @param context 
     * @param params 
     * @returns 
     */
    static async resetPassword(
        context: GraphQLContext,
        params: {
            email: string,
            password: string,
        },
    ): Promise<User> {
        const user = context.user

        if (! user) {
            throw new Error()
        }

        const target = await context.prisma.user.findFirstOrThrow({
            where: { email: params.email },
        })

        return await context.prisma.user.update({
            where: { id: target.id },
            data: {
                password: await AUthNUtil.hash({ password: params.password }),
            },
        })
    }

    /**
     * ユーザーを削除します (取り除きます)
     * 
     * @param context 
     * @param params 
     * @returns 
     */
    static async removeUser(
        context: GraphQLContext,
        params: {
            email: string,
        },
    ): Promise<User> {
        const user = context.user

        if (! user) {
            throw new Error()
        }

        const target = await context.prisma.user.findFirstOrThrow({
            where: { email: params.email },
        })

        // 自分自身は削除できないようにする
        if (user.email === target.email) {
            throw new Error()
        }

        return await context.prisma.user.delete({
            where: { id: target.id },
        })
    }
}
