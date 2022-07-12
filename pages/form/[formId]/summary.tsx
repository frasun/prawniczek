import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { getFromStore } from '../../../utils/helpers'
import { FORM, ANSWERS } from '../../../utils/constants'
import {
    ComponentLib,
    QuestionOptions,
    FormTitle,
    FormType,
} from '../../../utils/types'
import MESSAGES from '../../../messages/messages'
import Breadcrumbs from '../../../components/breadcrumbs'
import { User } from '../../../utils/useUser'

const textFields = [ComponentLib.shortText, ComponentLib.longText]

interface SummaryProps {
    user: User
}

const Summary: FC<SummaryProps> = ({ user }) => {
    const router = useRouter()
    const [formTitle, setFormTitle] = useState<FormTitle>('')
    const [questions, setQuestions] = useState<FormType['form']['questions']>()
    const [answers, setAnswers] = useState<[string, string][]>([])
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

    function getItems(
        questions: FormType['form']['questions'],
        answers: [string, string][]
    ) {
        const items = answers.map(([key, value]) => {
            const el = questions && questions.find(({ id }) => id === key)
            let answer = null

            if (el) {
                const { options, type } = el

                answer = textFields.includes(type)
                    ? value
                    : Array.isArray(value)
                    ? value.map((val) => getChoiceAnswer(val, options))
                    : getChoiceAnswer(value, options)
            }

            return {
                question: el ? el.title : null,
                answer,
            }
        })

        return items
    }

    function getChoiceAnswer(
        choiceRef: string,
        options: QuestionOptions['options']
    ) {
        const el = options && options.find(({ ref }) => ref === choiceRef)
        return el ? el.label : null
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
                            <button className='btn btn-sm btn-primary'>
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

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
    return {
        props: { user: req.session.user || null },
    }
}, sessionOptions)
