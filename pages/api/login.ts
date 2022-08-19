import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../utils/session'
import { postToApi, getFromApi } from '../../utils/api'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const {
        body: { username, password },
        session,
    } = req

    if (!session.token) {
        const response = await postToApi('login', {
            email: username,
            password,
        })

        if (response.ok) {
            session.token = response.authToken
            await session.save()
        } else {
            return res.status(response.status).json(response)
        }
    }

    if (!session.user) {
        const userResponse = await getFromApi('user', undefined, session.token)

        if (userResponse.ok) {
            const { email, name } = userResponse
            const user = { email, name, isLoggedIn: true }

            session.user = user
            await session.save()

            return res.json(user)
        } else {
            return res.status(userResponse.status).json({ isLoggedIn: false })
        }
    } else {
        const { email, name } = session.user
        return res.json({ email, name, isLoggedIn: true })
    }
}
