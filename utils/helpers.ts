export function getFromStore(key: string) {
    const field = sessionStorage.getItem(key)
    return field ? JSON.parse(field) : null
}