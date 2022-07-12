import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../utils/session'
import { postToApi, getFromApi } from '../../utils/api'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = await req.body
    const { session } = await req

    if (!session.token) {
        const { authToken } = await postToApi('login', {
            email: username,
            password,
        })
        req.session.token = authToken
        await req.session.save()
    }

    const { email, name } = await getFromApi('user', undefined, session.token)

    req.session.user = { email, name, isLoggedIn: true }
    await req.session.save()

    return res.json({ email, name, isLoggedIn: true })
}
