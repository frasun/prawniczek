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
        const { authToken } = await postToApi('login', {
            email: username,
            password,
        })
        session.token = authToken
        await session.save()
    }

    const { email, name } = await getFromApi('user', undefined, session.token)

    session.user = { email, name, isLoggedIn: true }
    await session.save()

    return res.json({ email, name, isLoggedIn: true })
}
