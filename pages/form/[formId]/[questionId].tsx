import { useState, useEffect, FC } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import styled from 'styled-components'

import QuestionType from '../../../components/questionType'
import Breadcrums from '../../../components/breadcrumbs'
import MESSAGES from '../../../messages/messages'

import {
    ComponentLib,
    FormType,
    SingleChoiceAnswer,
    MultiChoiceAnswer,
    QuestionOptions,
} from '../../../utils/types'

interface QuestionComponent {
    formId: string
    questionId: string
}

type FormTitle = FormType['form']['formTitle']

const Footer = styled.nav.attrs(() => ({
    className: `flex w-full`,
}))`
    justify-content: flex-end;
    &[data-spaced='true'] {
        justify-content: space-between;
    }
`

const FORM = 'form'
const ANSWERS = 'formAnswers'

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

    function getFromStore(key: string) {
        const field = sessionStorage.getItem(key)
        return field ? JSON.parse(field) : null
    }

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

                    <Breadcrums items={[formTitle]} />

                    <header>
                        <h1 className='text-2xl font-bold'>{questionTitle}</h1>
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
                        {!isLastQuestion && (
                            <button
                                onClick={goToNextQuestion}
                                className='btn btn-sm'
                                disabled={required && !isFilled}>
                                {MESSAGES.form.next}
                            </button>
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
