import type { IronSessionOptions } from 'iron-session'
import Router, { NextRouter } from 'next/router'
import { User } from './useUser'
import { postToApi } from '../utils/api'

declare module 'iron-session' {
    interface IronSessionData {
        user?: User
        token?: string
    }
}

export const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'session',
    ttl: 86400,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

export async function signIn(
    username?: string,
    password?: string,
    redirectTo?: string | Partial<NextRouter>
) {
    const redirect = redirectTo || window.location.href

    const response = await postToApi('signin', { username, password })

    if (response.ok) {
        Router.push(redirect)
    } else {
        window.alert(response.message)
    }

    return response
}

export async function signOut(redirectTo?: string) {
    const redirect = redirectTo || '/'
    const a = await fetch('/api/logout', { method: 'POST' })
    Router.push(redirect)
    return a.json()
}

export async function signUp(
    name: string,
    email: string,
    password: string,
    redirectTo?: string | Partial<NextRouter>
) {
    const redirect = redirectTo || window.location.href

    const response = await postToApi('signup', { name, email, password })

    if (response.ok) {
        Router.push(redirect)
    } else {
        window.alert(response.message)
    }

    return response
}

export async function magicSingIn(magicToken: string) {
    return await postToApi('magicLogin', { maginc_token: magicToken })
}
