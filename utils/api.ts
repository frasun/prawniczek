const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:fccO_oAf'

interface ApiType {
    [name: string]: string
}

const API: ApiType = {
    category: `${API_URL}/category`,
    forms: `${API_URL}/forms`,
    form: `${API_URL}/form`,
    login: `${API_URL}/auth/login`,
    user: `${API_URL}/auth/me`,
}

export async function getFromApi<T>(
    endpoint: string,
    params?: string | string[],
    token?: string
): Promise<T> {
    const url = params ? `${API[endpoint]}/${params}` : API[endpoint]
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return await response.json()
}

export async function postToApi<T>(
    endpoint: string,
    params: T,
    token?: string
) {
    const response = await fetch(API[endpoint], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: params ? JSON.stringify(params) : undefined,
    })
    return await response.json()
}
