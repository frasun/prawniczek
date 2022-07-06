const API_URL = {
    xano: 'https://x8ki-letl-twmt.n7.xano.io/api:fccO_oAf',
    tf: 'https://api.typeform.com'
}

const API_HEADERS = {
    tf: {
        'Authorization': 'Bearer tfp_6L9DgR91KBBDbdek37F87Cf9LNVHfCtz5vd7ZxaiyrEf_3suHXH73CATfpu'
    }
}

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
        url: `${API_URL.xano}/category`
    },
    forms: {
        url: `${API_URL.tf}/forms`,
        headers: API_HEADERS.tf
    }
}

export async function getFromApi<T>(endpoint: string, params?: string|string[]): Promise<T> {
    const url = params ? `${API[endpoint].url}/${params}` : API[endpoint].url
    const headers = API[endpoint].headers || {}
    const response = await fetch(url, {headers})
    return await response.json()
}
