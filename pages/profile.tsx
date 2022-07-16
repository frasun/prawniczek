import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../utils/session'
import { format } from 'date-fns'
import MESSAGES from '../constants/messages'
import DATE_FORMAT from '../constants/date'
import { getFromApi } from '../utils/api'
import { Document } from '../utils/types'

const Profile: FC<{ documents: Document[] }> = ({ documents }) => (
    <>
        <Head>
            <title>
                {MESSAGES.global.appName} - {MESSAGES.profile.title}
            </title>
        </Head>
        <header>
            <h1 className='text-2xl font-bold'>{MESSAGES.profile.title}</h1>
        </header>
        {documents.length &&
            documents.map(
                (
                    {
                        created_at: createdAt,
                        title,
                        document_id: documentId,
                        template,
                    },
                    index
                ) => (
                    <div
                        key={`${index}`}
                        className='prose'>
                        <h4>{title.length ? title : template}</h4>
                        <h6>
                            {MESSAGES.document.templateName}: {template}
                        </h6>
                        <h6>
                            {MESSAGES.document.createdAt}:{' '}
                            {format(createdAt, DATE_FORMAT)}
                        </h6>
                        <Link href={`/document/${documentId}/summary`}>
                            <button className='btn btn-sm btn-primary'>
                                {MESSAGES.document.summary}
                            </button>
                        </Link>
                    </div>
                )
            )}
        {!documents.length && <p>{MESSAGES.profile.empty}</p>}
        <footer className='mt-6'>
            <Link href='/forms'>
                <button className='btn btn-sm btn-primary'>
                    {MESSAGES.profile.newDocument}
                </button>
            </Link>
        </footer>
    </>
)

export default Profile

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
}) {
    const { token } = req.session
    let documents: Document[] = []

    if (!token) {
        res.setHeader('location', '/auth')
        res.statusCode = 302
        res.end()
    } else {
        documents = await getFromApi('document', undefined, token)
    }
    return {
        props: {
            documents,
        },
    }
},
sessionOptions)
