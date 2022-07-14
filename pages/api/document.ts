import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../utils/session'
import { postToApi } from '../../utils/api'

export default withIronSessionApiRoute(docuemntRoute, sessionOptions)

async function docuemntRoute(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        session: { token },
    } = await req

    if (token) {
        const response = await postToApi('document', body, token)

        return response.ok ? res.status(200).end() : res.send(response)
    }

    return res.status(401).end()
}
