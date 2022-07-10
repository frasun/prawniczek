const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:fccO_oAf'

interface ApiType {
    [name: string] :{
        url: string
        headers?: {
            [hedaer:string]:string
        }
    }
}

const API:ApiType = {
    category: {
        url: `${API_URL}/category`
    },
    forms: {
        url: `${API_URL}/forms`
    },
    form: {
        url: `${API_URL}/form`
    }
}

export async function getFromApi<T>(endpoint: string, params?: string|string[]): Promise<T> {
    const url = params ? `${API[endpoint].url}/${params}` : API[endpoint].url
    const headers = API[endpoint].headers || {}
    const response = await fetch(url, {headers})
    return await response.json()
}
