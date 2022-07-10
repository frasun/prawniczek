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
import validators, { validate } from '../../../utils/validators'

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
    const [validation, setValidation] =
        useState<QuestionOptions['validation']>(null)
    const [isFirstQuestion, setIsFirstQuestion] = useState(false)
    const [isLastQuestion, setIsLastQuestion] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [isValid, setIsValid] = useState(true)
    const [answer, setAnswer] = useState<string | string[]>()
    const [validationMessage, setValidationMessage] = useState<string>()

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

        if (isLoading) {
            if (form && answers) {
                const { questions, formTitle } = form
                const currentQuestionIndex = questions.findIndex(
                    ({ id }) => id === questionId
                )
                const {
                    title,
                    description,
                    type,
                    options,
                    required,
                    next,
                    validation,
                } = questions[currentQuestionIndex]
                const answer = answers[questionId]

                setFormTitle(formTitle)
                setQuestionTitle(title)
                setDescription(description)
                setType(type)
                setRequired(required)
                setIsFirstQuestion(currentQuestionIndex === 0)
                setIsLastQuestion(currentQuestionIndex === questions.length - 1)
                setOptions(options)
                setNextId(next)
                setValidation(validation)

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
            handleTextChange(val as string)
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

        if (answers.length) {
            saveAnswer(answers)
        } else {
            clearAnswer()
            setIsFilled(false)
        }
    }

    function handleTextChange(val: string) {
        if (validation) {
            const { pattern, message } = validators[validation]

            if (validate(val, pattern)) {
                saveAnswer(val)
                setIsValid(true)
                setValidationMessage(undefined)
            } else {
                setIsValid(false)
                clearAnswer()
                setValidationMessage(message)
            }
        } else {
            saveAnswer(val)
        }
    }

    function goToNextQuestion() {
        router.push(`/form/${formId}/${nextId}`)
    }

    function goToPrevQuestion() {
        router.back()
    }

    function saveAnswer(answer: string | string[]) {
        const hasValue = answer.length > 0

        if (hasValue) {
            setAnswerInStore(answer)
        } else {
            clearAnswer()
        }

        if (required) {
            setIsFilled(hasValue)
            if (!hasValue) {
                setValidationMessage(MESSAGES.validations.required)
            } else {
                setValidationMessage(undefined)
            }
        }
    }

    function clearAnswer() {
        const currentFormAnswers = getFromStore(ANSWERS)

        sessionStorage.setItem(
            'formAnswers',
            JSON.stringify({
                ...currentFormAnswers,
                [questionId]: undefined,
            })
        )
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

    function canGoNext() {
        return (typeof validation === 'string' ? isValid || !isFilled : true) &&
            required
            ? isFilled
            : true
    }

    return (
        <>
            {!isLoading ? (
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
                            {required && <span className='text-error'>*</span>}
                        </h1>
                        {description && <p>{description}</p>}
                    </header>

                    <div
                        className={`w-full${
                            validationMessage
                                ? ' tooltip tooltip-error tooltip-bottom tooltip-open'
                                : ''
                        }`}
                        data-tip={
                            validationMessage ? validationMessage : undefined
                        }>
                        <QuestionType
                            type={type}
                            options={options}
                            onValueChange={handleValueChange}
                            answer={answer}
                        />
                    </div>

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
                                disabled={!canGoNext()}>
                                {MESSAGES.form.next}
                            </button>
                        )}
                        {(isLastQuestion || nextId === MESSAGES.form.last) && (
                            <Link href={`/form/${formId}/summary`}>
                                <button
                                    className='btn btn-sm'
                                    disabled={!canGoNext()}>
                                    {MESSAGES.form.finish}
                                </button>
                            </Link>
                        )}
                    </Footer>
                </>
            ) : (
                <progress className='progress'></progress>
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
