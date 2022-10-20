import { FC } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../utils/session'
import { getFromApi } from '../../utils/api'
import getDocument from '../../utils/document'
import { mapFormResponse } from '../form/[formId]'

type DocumentProps = {
    documentData: string[] | null
    title: string | null
}

const Document: FC<DocumentProps> = ({ documentData, title }) => {
    return (
        <>
            <h1 className='text-2xl font-bold'>{title}</h1>
            {documentData && documentData.map((p, ind) => <p key={ind}>{p}</p>)}
        </>
    )
}

export default Document

export const getServerSideProps = withIronSessionSsr(
    async ({ req, res, query }) => {
        const { documentId } = query
        const { token } = req.session
        const props: DocumentProps = { documentData: null, title: null }

        if (!token) {
            res.setHeader('location', '/signin')
            res.statusCode = 302
            res.end()
        } else {
            const document = await getFromApi(
                'document',
                `/${documentId}`,
                token
            )

            const { title, document_id: docId } = document

            if (title) {
                props['title'] = title
            }

            if (docId) {
                const form = await getFromApi('form', `/${docId}`)

                const documentData = getDocument(
                    mapFormResponse(form).questions,
                    form.variables,
                    document.summary
                )

                if (documentData) {
                    props['documentData'] = documentData
                }
            }
        }

        return { props }
    },
    sessionOptions
)
