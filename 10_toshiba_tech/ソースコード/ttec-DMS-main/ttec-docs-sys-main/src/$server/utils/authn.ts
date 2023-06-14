import * as argon2 from 'argon2'

class AUthNUtilKlass {
    // NOTE: パスワードハッシュ要件
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
    //
    // OWASP 推奨値:
    // - 15 MiB のメモリ，反復回数 2，並列度 1 の最小構成で Argon2id を使用

    private readonly TYPE: 0 | 1 | 2 = argon2.argon2id
    private readonly MEMORY_COST: number = 1024 * 15 // 15 MiB (1 = 1 KiB)
    private readonly PARALLELISM: number = 1 // 並列度
    private readonly TIME_COST: number = 2 // 反復回数

    /**
     * パスワードのハッシュ化を行います
     *
     * @param params
     * @returns
     */
    public async hash(params: { password: string }): Promise<string> {
        return await argon2.hash(params.password, {
            type: this.TYPE,
            memoryCost: this.MEMORY_COST,
            parallelism: this.PARALLELISM,
            timeCost: this.TIME_COST,
        })
    }

    /**
     * パスワード <> ハッシュの妥当性を検証します
     *
     * @param params
     * @returns
     */
    public async verify(params: { password: string; hash: string }): Promise<boolean> {
        return await argon2.verify(params.hash, params.password, {
            type: this.TYPE,
            memoryCost: this.MEMORY_COST,
            parallelism: this.PARALLELISM,
            timeCost: this.TIME_COST,
        })
    }
}

export const AUthNUtil = new AUthNUtilKlass()
