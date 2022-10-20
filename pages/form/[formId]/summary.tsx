import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { getFromStore } from '../../../utils/storage'
import { FORM, ANSWERS } from '../../../constants/store'
import { FormTitle, Document, FormAnswer } from '../../../utils/types'
import MESSAGES from '../../../constants/messages'
import Breadcrumbs from '../../../components/breadcrumbs'
import { User } from '../../../utils/useUser'
import getSummary from '../../../utils/form'
import DocumentNameModal from '../../../components/documentNameModal'

interface SummaryProps {
    user: User
}

const Summary: FC<SummaryProps> = ({ user }) => {
    const router = useRouter()
    const [formTitle, setFormTitle] = useState<FormTitle>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [documentName, setDocumentName] = useState<string>(formTitle)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [documentId, setDocumentId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const [summary, setSummary] = useState<Document['summary']>([])
    const [isDraft, setIsDraft] = useState<boolean>(true)

    const pageTitle = `${MESSAGES.global.appName} - ${formTitle}`

    const breadcrumb = [
        {
            name: MESSAGES.forms.pageTitle,
            url: '/forms',
        },
        {
            name: formTitle,
            icon: 'newDocument',
        },
        {
            name: MESSAGES.form.finish,
            icon: null,
        },
    ]

    useEffect(() => {
        const form = getFromStore(FORM)
        const formAnswers: FormAnswer = getFromStore(ANSWERS)

        if (isLoading) {
            if (form && formAnswers) {
                const {
                    title,
                    questions,
                    documentId,
                    templateId,
                    documentName,
                } = form

                setFormTitle(documentName || title)
                setDocumentName(documentName || title)
                setDocumentId(documentId)
                setTemplateId(templateId)

                if (questions) {
                    setSummary(getSummary(questions, formAnswers))
                }

                setIsLoading(false)

                if (router.query.save) {
                    saveDocument(router.query.draft === 'true')
                }
            } else {
                router.push(`/`)
            }
        }
    }, [router, isLoading])

    async function postDocument(draft = false) {
        const document = {
            template_id: templateId,
            answers: JSON.stringify(getFromStore(ANSWERS)),
            summary,
            title: documentName,
            document_created: draft,
        }

        const response = await fetch('/api/document', {
            method: 'post',
            body: JSON.stringify(document),
            headers: {
                'Content-type': 'application/json',
            },
        })

        return response.json()
    }

    async function updateDocument(documentCreated = false) {
        const document = {
            document_id: documentId,
            answers: JSON.stringify(getFromStore(ANSWERS)),
            summary,
            document_created: documentCreated,
        }

        const response = await fetch('/api/document', {
            method: 'put',
            body: JSON.stringify(document),
            headers: {
                'Content-type': 'application/json',
            },
        })

        return response.json()
    }

    function saveDocument(draft = false) {
        setIsDraft(draft)

        if (user?.isLoggedIn) {
            documentId ? saveChanges(true) : setShowModal(true)
        } else {
            router.push({
                pathname: '/signin',
                query: { redirect: window.location.href, save: true, draft },
            })
        }
    }

    function handleNameSet() {
        isDraft ? createDraft() : createDocument()
    }

    async function createDraft() {
        const document = await postDocument()

        if (document.ok) {
            router.push('/profile')
        }
    }

    async function saveChanges(documentCreated = false) {
        const document = await updateDocument(documentCreated)

        if (document.ok) {
            documentCreated
                ? router.push(`/document/${document.id}/`)
                : router.push('/profile')
        }
    }

    async function createDocument() {
        const document = await postDocument(true)

        if (document.ok) {
            router.push(`/document/${document.document_id}/`)
        }
    }

    return (
        <>
            {!isLoading ? (
                <>
                    <Head>
                        <title>{pageTitle}</title>
                    </Head>
                    <Breadcrumbs items={breadcrumb} />
                    <header className='prose'>
                        <h1>{formTitle}</h1>
                    </header>
                    {summary &&
                        summary.length > 0 &&
                        summary.map(({ question, answer }, index) => (
                            <div
                                key={index}
                                className='prose'>
                                <h3>{question}</h3>
                                {Array.isArray(answer) && answer.length ? (
                                    <ul>
                                        {answer.map((item, ind) => (
                                            <li key={ind}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <h5>{answer}</h5>
                                )}
                            </div>
                        ))}
                    <footer>
                        {documentId ? (
                            <button
                                className='btn btn-sm btn-primary'
                                onClick={() => saveChanges()}>
                                {MESSAGES.summary.saveAnswers}
                            </button>
                        ) : (
                            <button
                                className='btn btn-sm btn-primary'
                                onClick={() => saveDocument(true)}>
                                {MESSAGES.summary.saveAnswers}
                            </button>
                        )}
                        <button
                            className='btn btn-sm btn-primary ml-2'
                            onClick={() => saveDocument()}>
                            {MESSAGES.summary.createDocument}
                        </button>
                    </footer>
                    <DocumentNameModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        documentName={documentName}
                        setDocumentName={setDocumentName}
                        handleSubmit={handleNameSet}
                    />
                </>
            ) : (
                <progress className='progress'></progress>
            )}
        </>
    )
}

export default Summary

export const getServerSideProps = withIronSessionSsr(async ({ req, query }) => {
    const { formId } = query
    return {
        props: { user: req.session.user || null, formId },
    }
}, sessionOptions)
