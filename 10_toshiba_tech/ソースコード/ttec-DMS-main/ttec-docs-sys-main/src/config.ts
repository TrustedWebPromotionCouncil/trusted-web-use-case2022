class AppConfig {
    private fetch(value: any, defaultValue?: string): string | undefined {
        if (value === '' || value === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue
            } else {
                return undefined
            }
        }

        return value
    }

    get NODE_ENV(): string {
        const v = this.fetch(process.env.NODE_ENV)
        const d = 'development' // Default Env

        if (v === undefined) {
            return d
        }

        return v.toLowerCase()
    }

    get IN_PRODUCTION(): boolean {
        return this.NODE_ENV === 'production'
    }

    get REDIS_URL(): string {
        const v = this.fetch(process.env.REDIS_URL)

        if (v === undefined) {
            throw new Error()
        }

        return v
    }

    get DATABASE_URL(): string | undefined {
        return this.fetch(process.env.DATABASE_URL)
    }

    get PRISMA_FIELD_ENCRYPTION_KEY(): string {
        const v = this.fetch(process.env.PRISMA_FIELD_ENCRYPTION_KEY)

        if (v === undefined) {
            throw new Error()
        }

        return v
    }

    get BASIC_AUTH_USERNAME(): string | undefined {
        return this.fetch(process.env.BASIC_AUTH_USERNAME)
    }

    get BASIC_AUTH_PASSWORD(): string | undefined {
        return this.fetch(process.env.BASIC_AUTH_PASSWORD)
    }
}

export const Config = new AppConfig()
