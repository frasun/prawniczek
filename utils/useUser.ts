import useSWR from 'swr'

export interface User {
    name?: string
    email?: string
    isLoggedIn: boolean
}

export default function () {
    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const { data: user, mutate: mutateUser } = useSWR<User>(
        '/api/user',
        fetcher
    )

    return { user, mutateUser }
}
