import { NextRequest, NextResponse } from 'next/server'
import { Config } from './config'

export const config = {
    matcher: '/((?!api/healthcheck).*)',
}

export function middleware(req: NextRequest) {
    if (! Config.IN_PRODUCTION) {
        return NextResponse.next()
    }

    const basicAuth = req.headers.get('authorization')
    const url = req.nextUrl

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [ username, password ] = atob(authValue).split(':')

        if (username === 'ttec-cg' && password === 'ttec-cg') {
            return NextResponse.next()
        }
    }
    url.pathname = '/api/auth'

    return NextResponse.rewrite(url)
}