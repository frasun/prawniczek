import type { IronSessionOptions } from 'iron-session'
import Router from 'next/router'
import { User } from './useUser'

export const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'session',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
    interface IronSessionData {
        user?: User
        token?: string
    }
}

export async function signIn(
    username: string,
    password: string,
    redirectTo?: string
) {
    const redirect = redirectTo || window.location.href

    const a = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-type': 'application/json',
        },
    })
    Router.push(redirect)

    return a.json()
}

export async function signOut(redirectTo?: string) {
    const redirect = redirectTo || window.location.href
    const a = await fetch('/api/logout', { method: 'POST' })
    Router.push(redirect)
    return a.json()
}
