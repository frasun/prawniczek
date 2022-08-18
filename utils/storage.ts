export function getFromStore(key: string) {
    const field = localStorage.getItem(key)
    return field ? JSON.parse(field) : null
}
