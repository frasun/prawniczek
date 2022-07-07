import { useState, useEffect, FC } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import styled from 'styled-components'

import QuestionType from '../../../components/questionType'
import Breadcrums from '../../../components/breadcrumbs'
import MESSAGES from '../../../messages/messages'
import { getFromStore } from '../../../utils/helpers'
import { FORM, ANSWERS } from '../../../utils/constants'

import {
    ComponentLib,
    FormType,
    SingleChoiceAnswer,
    MultiChoiceAnswer,
    QuestionOptions,
    FormTitle,
} from '../../../utils/types'

interface QuestionComponent {
    formId: string
    questionId: string
}

const Footer = styled.nav.attrs(() => ({
    className: `flex w-full`,
}))`
    justify-content: flex-end;
    &[data-spaced='true'] {
        justify-content: space-between;
    }
`

const Question: FC<QuestionComponent> = ({ formId, questionId }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [formTitle, setFormTitle] = useState<FormTitle>('')
    const [questionTitle, setQuestionTitle] =
        useState<QuestionOptions['title']>('')
    const [description, setDescription] =
        useState<QuestionOptions['description']>(null)
    const [type, setType] = useState<QuestionOptions['type']>(
        ComponentLib.shortText
    )
    const [required, setRequired] = useState<QuestionOptions['required']>(false)
    const [options, setOptions] = useState<QuestionOptions['options']>(null)
    const [nextId, setNextId] = useState<QuestionOptions['next']>(null)
    const [isFirstQuestion, setIsFirstQuestion] = useState(false)
    const [isLastQuestion, setIsLastQuestion] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [answer, setAnswer] = useState<string | string[]>()

    const breadcrumb = [
        {
            name: MESSAGES.forms.pageTitle,
            url: '/forms',
        },
        {
            name: formTitle,
            icon: 'newDocument',
        },
    ]

    useEffect(() => {
        const form: FormType['form'] = getFromStore(FORM)
        const answers: { [key: string]: string | string[] } =
            getFromStore(ANSWERS)
        const answer = answers[questionId]

        if (isLoading) {
            if (form) {
                const { questions, formTitle } = form
                const currentQuestionIndex = questions.findIndex(
                    ({ id }) => id === questionId
                )
                const { title, description, type, options, required, next } =
                    questions[currentQuestionIndex]

                setFormTitle(formTitle)
                setQuestionTitle(title)
                setDescription(description)
                setType(type)
                setRequired(required)
                setIsFirstQuestion(currentQuestionIndex === 0)
                setIsLastQuestion(currentQuestionIndex === questions.length - 1)
                setOptions(options)
                setNextId(next)

                if (answer) {
                    setAnswer(answer)
                    setIsFilled(true)

                    if (type === ComponentLib['dropdown']) {
                        const { next } = options!.find(
                            ({ ref }) => ref === answer
                        )!
                        setNextId(next)
                    }
                }

                setIsLoading(false)
            } else {
                router.push(`/form/${formId}`)
            }
        }
    }, [questionId, isLoading, router, formId])

    function handleValueChange(
        val: SingleChoiceAnswer | MultiChoiceAnswer | string
    ) {
        if (type === ComponentLib.dropdown) {
            handleSingleChoiceChange(val as SingleChoiceAnswer)
        } else if (type === ComponentLib.multipleChoice) {
            handleMultipleChoiceChange(val as MultiChoiceAnswer)
        } else {
            saveAnswer(val as string)
        }
    }

    function handleSingleChoiceChange(val: SingleChoiceAnswer) {
        const { next, ref } = val
        setNextId(next)
        saveAnswer(ref)
    }

    function handleMultipleChoiceChange(val: MultiChoiceAnswer) {
        const { ref, checked } = val

        let answers = getFromStore(ANSWERS)[questionId] || []

        if (checked) {
            answers.push(ref)
        } else {
            answers.splice(answers.indexOf(ref), 1)
        }

        saveAnswer(answers)
    }

    function goToNextQuestion() {
        router.push(`/form/${formId}/${nextId}`)
    }

    function goToPrevQuestion() {
        router.back()
    }

    function saveAnswer(answer: string | string[]) {
        setAnswerInStore(answer)
        setIsFilled(answer.length > 0)
    }

    function setAnswerInStore(answer: string | string[]) {
        const currentFormAnswers = getFromStore(ANSWERS)

        sessionStorage.setItem(
            'formAnswers',
            JSON.stringify({
                ...currentFormAnswers,
                [questionId]: answer,
            })
        )
    }

    return (
        <>
            {!isLoading && (
                <>
                    <Head>
                        <title>
                            {MESSAGES.global.appName} - {formTitle}
                        </title>
                    </Head>

                    <Breadcrums items={breadcrumb} />

                    <header>
                        <h1 className='text-2xl font-bold'>
                            {questionTitle}
                            {required && (
                                <span
                                    className='text-error tooltip tooltip-error'
                                    data-tip={MESSAGES.form.required}>
                                    *
                                </span>
                            )}
                        </h1>
                        {description && <p>{description}</p>}
                    </header>

                    <QuestionType
                        type={type}
                        options={options}
                        onValueChange={handleValueChange}
                        answer={answer}
                    />

                    <Footer data-spaced={!isFirstQuestion}>
                        {!isFirstQuestion && (
                            <button
                                className='btn btn-sm'
                                onClick={goToPrevQuestion}>
                                {MESSAGES.form.back}
                            </button>
                        )}
                        {!isLastQuestion && nextId !== MESSAGES.form.last && (
                            <button
                                onClick={goToNextQuestion}
                                className='btn btn-sm'
                                disabled={required && !isFilled}>
                                {MESSAGES.form.next}
                            </button>
                        )}
                        {(isLastQuestion || nextId === MESSAGES.form.last) && (
                            <Link href={`/form/summary`}>
                                <button
                                    className='btn btn-sm'
                                    disabled={required && !isFilled}>
                                    {MESSAGES.form.finish}
                                </button>
                            </Link>
                        )}
                    </Footer>
                </>
            )}
        </>
    )
}

export default Question

export const getServerSideProps: GetServerSideProps = async (router) => {
    const { formId, questionId } = router.query

    return {
        props: {
            formId,
            questionId,
        },
    }
}
