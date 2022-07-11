import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { postToApi } from '../../../utils/api'

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { type: 'text' },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                let user
                if (credentials) {
                    const { username, password } = credentials
                    const { authToken } = await postToApi('login', {
                        email: username,
                        password,
                    })

                    user = {
                        authToken,
                    }
                }

                return user || null
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.authToken
            }

            return token
        },
        session({ session }) {
            return session
        },
    },
})
