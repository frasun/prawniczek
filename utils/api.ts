export const API_URL:string = 'https://x8ki-letl-twmt.n7.xano.io/api:fccO_oAf'

export const FETCH_CATEGORIES:string = `${API_URL}/category`

export async function getFromApi<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return await response.json()
}
