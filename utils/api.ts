import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

interface ApiType {
    [name: string]: string
}

const API: ApiType = {
    category: `${publicRuntimeConfig.API_URL}/category`,
    forms: `${publicRuntimeConfig.API_URL}/forms`,
    form: `${publicRuntimeConfig.API_URL}/form`,
    login: `${publicRuntimeConfig.API_URL}/auth/login`,
    user: `${publicRuntimeConfig.API_URL}/auth/me`,
    document: `${publicRuntimeConfig.API_URL}/document`,
    signup: `${publicRuntimeConfig.API_URL}/auth/verify_email/signup`,
    magicLogin: `${publicRuntimeConfig.API_URL}/auth/verify_email/magic_login`,
    resendLink: `${publicRuntimeConfig.API_URL}/auth/magic-link`,
    signin: '/api/login',
    template: `${publicRuntimeConfig.API_URL}/template`,
}

export async function getFromApi(
    endpoint: string,
    params?: string | string[],
    token?: string
) {
    const url = params ? `${API[endpoint]}${params}` : API[endpoint]
    const request = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const { status, ok } = request
    const response = {
        ...(await request.json()),
        status,
        ok,
    }

    return response
}

export async function postToApi<T>(
    endpoint: string,
    params: T,
    token?: string
) {
    const request = await fetch(API[endpoint], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: params ? JSON.stringify(params) : undefined,
    })

    const { status, ok } = request
    const response = {
        ...(await request.json()),
        status,
        ok,
    }

    return response
}

export async function putToApi<T>(endpoint: string, params: T, token?: string) {
    const request = await fetch(API[endpoint], {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: params ? JSON.stringify(params) : undefined,
    })

    const { status, ok } = request
    const response = {
        ...(await request.json()),
        status,
        ok,
    }

    return response
}
