import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { getFromStore } from '../../../utils/storage'
import { FORM, ANSWERS } from '../../../constants/store'
import { FormTitle, FormAnswer, FormQuestions } from '../../../utils/types'
import MESSAGES from '../../../constants/messages'
import Breadcrumbs from '../../../components/breadcrumbs'
import { User } from '../../../utils/useUser'
import getItems from '../../../utils/summary'

interface SummaryProps {
    user: User
    formId: string
}

const Summary: FC<SummaryProps> = ({ user, formId }) => {
    const router = useRouter()
    const [formTitle, setFormTitle] = useState<FormTitle>('')
    const [questions, setQuestions] = useState<FormQuestions>()
    const [answers, setAnswers] = useState<FormAnswer[]>([])
    const [isLoading, setIsLoading] = useState(true)

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
                        <footer>
                            <button
                                className='btn btn-sm btn-primary'
                                onClick={saveDocument}>
                                {MESSAGES.summary.saveDocument}
                            </button>
                        </footer>
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
