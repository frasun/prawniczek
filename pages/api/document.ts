import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../utils/session'
import { postToApi, putToApi } from '../../utils/api'

export default withIronSessionApiRoute(docuemntRoute, sessionOptions)

async function docuemntRoute(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        session: { token },
    } = req

    if (token) {
        let response
        if (req.method === 'POST') {
            response = await postToApi('document', body, token)
        } else if (req.method === 'PUT') {
            response = await putToApi('document', body, token)
        }

        return res.send(response)
    }

    return res.status(401).end()
}
