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
import { getFromApi } from '../../../utils/api'
import { mapFormResponse } from '../[formId]'
import getDocument from '../../../utils/document'

interface SummaryProps {
    user: User
    formId: string
}

const Summary: FC<SummaryProps> = ({ user, formId }) => {
    const router = useRouter()
    const [formTitle, setFormTitle] = useState<FormTitle>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [documentName, setDocumentName] = useState<string>(formTitle)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [documentId, setDocumentId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const [summary, setSummary] = useState<Document['summary']>([])
    const [documentData, setDocumentData] = useState<string[]>([])

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
                const { title, questions, documentId, templateId } = form

                setFormTitle(title)
                setDocumentName(title)
                setDocumentId(documentId)
                setTemplateId(templateId)

                if (questions) {
                    setSummary(getSummary(questions, formAnswers))
                }

                setIsLoading(false)

                if (router.query.save) {
                    setShowModal(true)
                }
            } else {
                router.push(`/`)
            }
        }
    }, [router, isLoading])

    async function postDocument(redirect = true) {
        const document = {
            template_id: templateId,
            answers: JSON.stringify(getFromStore(ANSWERS)),
            summary,
            title: documentName,
        }

        const response = await fetch('/api/document', {
            method: 'post',
            body: JSON.stringify(document),
            headers: {
                'Content-type': 'application/json',
            },
        })

        if (redirect) {
            handleDocumentChange(response)
        } else {
            return response.json()
        }
    }

    async function updateDocument() {
        const document = {
            document_id: formId,
            answers: JSON.stringify(getFromStore(ANSWERS)),
            summary,
        }

        const response = await fetch('/api/document', {
            method: 'put',
            body: JSON.stringify(document),
            headers: {
                'Content-type': 'application/json',
            },
        })

        handleDocumentChange(response)
    }

    function saveDocument() {
        if (user?.isLoggedIn) {
            documentId ? updateDocument() : setShowModal(true)
        } else {
            router.push({
                pathname: '/signin',
                query: { redirect: window.location.href, save: true },
            })
        }
    }

    function handleDocumentChange(response: Response) {
        if (response.ok) {
            router.push('/profile')
        }
    }

    async function previewDocument() {
        setDocumentData(['loading'])

        const template = await getFromApi('template', `/${templateId}`)

        if (template.ok) {
            const newDocument = await postDocument(false)
            const { document_id: documentId } = template

            if (newDocument.ok) {
                const { document_id: newDocumentId } = newDocument
                const document = await getFromApi(
                    'document',
                    `/${newDocumentId}`
                )
                const form = await getFromApi('form', `/${documentId}`)

                const a = getDocument(
                    mapFormResponse(form).questions,
                    form.variables,
                    document.summary
                )

                setDocumentData(a)
            }
        } else {
            console.error('brak')
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
                        <button
                            className='btn btn-sm btn-primary'
                            onClick={saveDocument}>
                            {MESSAGES.summary.saveDocument}
                        </button>
                        <button
                            className='btn btn-sm btn-primary ml-2'
                            onClick={previewDocument}>
                            Generuj dokument
                        </button>
                    </footer>
                    {documentData.length && (
                        <aside>
                            {documentData.map((p, ind) => (
                                <p key={ind}>{p}</p>
                            ))}
                        </aside>
                    )}
                    <DocumentNameModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        documentName={documentName}
                        setDocumentName={setDocumentName}
                        handleSubmit={postDocument}
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
