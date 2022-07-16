import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { getFromStore } from '../../../utils/storage'
import { FORM, ANSWERS } from '../../../constants/store'
import { FormTitle, FormAnswer, FormQuestions } from '../../../utils/types'
import MESSAGES from '../../../constants/messages'
import Breadcrumbs from '../../../components/breadcrumbs'
import Modal from '../../../components/modal'
import { User } from '../../../utils/useUser'
import getItems from '../../../utils/summary'
import ShortText from '../../../components/shortText'

interface SummaryProps {
    user: User
    formId: string
}

const Summary: FC<SummaryProps> = ({ user, formId }) => {
    const router = useRouter()
    const [formTitle, setFormTitle] = useState<FormTitle>('')
    const [questions, setQuestions] = useState<FormQuestions>()
    const [answers, setAnswers] = useState<FormAnswer[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [documentName, setDocumentName] = useState<string>(formTitle)

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
        const formAnswers = getFromStore(ANSWERS)

        if (isLoading) {
            if (form && formAnswers) {
                const { formTitle, questions } = form

                setFormTitle(formTitle)
                setDocumentName(formTitle)
                setQuestions(questions)
                setAnswers(Object.entries(formAnswers))
                setIsLoading(false)
            } else {
                router.push(`/`)
            }
        }
    }, [router, isLoading])

    async function saveDocument() {
        const document = {
            template_id: formId,
            answers: JSON.stringify(answers),
            title: documentName,
        }

        const response = await fetch('/api/document', {
            method: 'post',
            body: JSON.stringify(document),
            headers: {
                'Content-type': 'application/json',
            },
        })

        if (response.ok) {
            router.push('/profile')
        }
    }

    return (
        <>
            {!isLoading ? (
                <>
                    <Breadcrumbs items={breadcrumb} />
                    <header className='prose'>
                        <h1>{formTitle}</h1>
                    </header>
                    {questions &&
                        getItems(questions, answers).map(
                            ({ question, answer }, index) => (
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
                            )
                        )}
                    {user?.isLoggedIn && (
                        <>
                            <footer>
                                <button
                                    className='btn btn-sm btn-primary'
                                    onClick={() => setShowModal(true)}>
                                    {MESSAGES.summary.saveDocument}
                                </button>
                            </footer>
                            <Modal selector='#modal'>
                                <input
                                    id='showModal'
                                    type='checkbox'
                                    className='modal-toggle'
                                    checked={showModal}
                                    onChange={(e) =>
                                        setShowModal(e.target.checked)
                                    }
                                />
                                <div
                                    className='modal'
                                    id='save-document-modal'>
                                    <div className='modal-box relative'>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className='btn btn-sm btn-circle absolute right-2 top-2'>
                                            ✕
                                        </button>
                                        Podaj nazwę dokumentu
                                        <ShortText
                                            answer={documentName}
                                            onValueChange={(val) =>
                                                setDocumentName(val as string)
                                            }
                                        />
                                        <button
                                            className='btn btn-sm btn-primary'
                                            disabled={documentName.length === 0}
                                            onClick={saveDocument}>
                                            {MESSAGES.summary.saveDocument}
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </>
                    )}
                </>
            ) : (
                <progress className='progress'></progress>
            )}
        </>
    )
}

export default Summary

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    query,
}) {
    const { formId } = query
    return {
        props: { user: req.session.user || null, formId },
    }
},
sessionOptions)
