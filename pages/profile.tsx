import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../utils/session'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import MESSAGES from '../constants/messages'
import DATE_FORMAT from '../constants/date'
import { getFromApi } from '../utils/api'
import { Document } from '../utils/types'
import DocumentNameModal from '../components/documentNameModal'

const Profile: FC<{ documents: Document[] }> = ({ documents }) => {
    const [documentName, setDocumentName] = useState<string>('')
    const [showModal, setShowModal] = useState<boolean>(false)
    const [documentId, setDocumentId] = useState<string | undefined>()
    const router = useRouter()
    const pageTitle = `${MESSAGES.global.appName} - ${MESSAGES.profile.title}`

    useEffect(() => {
        localStorage.clear()
    }, [])

    function editDocumentName(documentId: string, title: string) {
        setDocumentName(title)
        setDocumentId(documentId)
        setShowModal(true)
    }

    async function renameDocument() {
        const document = {
            document_id: documentId,
            title: documentName,
        }

        const response = await fetch('/api/document', {
            method: 'put',
            body: JSON.stringify(document),
            headers: {
                'Content-type': 'application/json',
            },
        })

        if (response.ok) {
            setDocumentName('')
            setDocumentId(undefined)
            setShowModal(false)

            router.push(window.location.href)
        }
    }

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <header>
                <h1 className='text-2xl font-bold'>{MESSAGES.profile.title}</h1>
            </header>
            {documents.length > 0 &&
                documents.map(
                    (
                        {
                            created_at: createdAt,
                            title,
                            document_id: documentId,
                            template,
                            document_created: documentCreated,
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
                            {documentCreated ? (
                                <Link href={`/document/${documentId}`}>
                                    <button className='btn btn-sm btn-primary ml-2'>
                                        {MESSAGES.document.preview}
                                    </button>
                                </Link>
                            ) : (
                                <Link href={`/form/${documentId}`}>
                                    <button className='btn btn-sm btn-primary ml-2'>
                                        {MESSAGES.document.edit}
                                    </button>
                                </Link>
                            )}

                            <button
                                className='btn btn-sm btn-primary ml-2'
                                onClick={() =>
                                    editDocumentName(documentId, title)
                                }>
                                {MESSAGES.document.rename}
                            </button>
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
            <DocumentNameModal
                showModal={showModal}
                setShowModal={setShowModal}
                documentName={documentName}
                setDocumentName={setDocumentName}
                handleSubmit={renameDocument}
            />
        </>
    )
}

export default Profile

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    const { token } = req.session

    if (!token) {
        res.setHeader('location', '/signin')
        res.statusCode = 302
        res.end()

        return {
            props: {
                documents: [],
            },
        }
    } else {
        const { documents } = await getFromApi('document', undefined, token)
        return {
            props: {
                documents,
            },
        }
    }
}, sessionOptions)
