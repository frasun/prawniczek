import { useState, useEffect, FC, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'

import QuestionType from '../../../components/questionType'
import Breadcrums from '../../../components/breadcrumbs'
import MESSAGES from '../../../constants/messages'
import { getFromStore } from '../../../utils/storage'
import { FORM, ANSWERS } from '../../../constants/store'
import validators, { validate } from '../../../utils/validators'
import { getNextId } from '../../../utils/form'

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
    const [nextId, setNextId] = useState<string | null>(null)
    const [validation, setValidation] =
        useState<QuestionOptions['validation']>(null)
    const [isFirstQuestion, setIsFirstQuestion] = useState(false)
    const [isLastQuestion, setIsLastQuestion] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [isValid, setIsValid] = useState(true)
    const [answer, setAnswer] = useState<string | string[]>()
    const [validationMessage, setValidationMessage] = useState<string>()

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
    ]

    const setNext = useCallback(() => {
        const nextQuestion = getNextId(questionId)

        setNextId(nextQuestion)
        setIsLastQuestion(nextQuestion ? false : true)
    }, [questionId])

    useEffect(() => {
        if (isLoading) {
            const form: FormType['form'] = getFromStore(FORM)
            const answers: { [key: string]: string | string[] } =
                getFromStore(ANSWERS)
            if (form && answers) {
                const { questions, title } = form
                const currentQuestionIndex = questions.findIndex(
                    ({ id }) => id === questionId
                )
                const {
                    title: Qtitle,
                    description,
                    type,
                    options,
                    required,
                    validation,
                } = questions[currentQuestionIndex]
                const answer = answers[questionId]

                setFormTitle(title)
                setQuestionTitle(Qtitle)
                setDescription(description)
                setType(type)
                setRequired(required)
                setIsFirstQuestion(currentQuestionIndex === 0)
                setIsLastQuestion(currentQuestionIndex === questions.length - 1)
                setOptions(options)
                setValidation(validation)

                if (answer) {
                    setAnswer(answer)
                    setIsFilled(true)
                }

                setNext()

                setIsLoading(false)
            }
        }
    }, [questionId, isLoading, router, formId, setNext])

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

        setNext()
    }

    function handleSingleChoiceChange(val: SingleChoiceAnswer) {
        const { next, ref } = val

        setNextId(next)
        saveAnswer(ref)
    }

    function handleMultipleChoiceChange(val: MultiChoiceAnswer) {
        const { ref, checked } = val
        const answers = getFromStore(ANSWERS)[questionId] || []

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

        setAnswer(answer)

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

        localStorage.setItem(
            'formAnswers',
            JSON.stringify({
                ...currentFormAnswers,
                [questionId]: undefined,
            })
        )
    }

    function setAnswerInStore(answer: string | string[]) {
        const currentFormAnswers = getFromStore(ANSWERS)

        localStorage.setItem(
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
                        <title>{pageTitle}</title>
                    </Head>

                    <Breadcrums items={breadcrumb} />

                    <header>
                        <h1 className='text-2xl font-bold'>
                            {questionTitle}
                            {required && <span className='text-error'>*</span>}
                        </h1>
                        {description && <p>{description}</p>}
                    </header>

                    <QuestionType
                        type={type}
                        options={options}
                        onValueChange={handleValueChange}
                        answer={answer}
                        validationMessage={validationMessage}
                    />

                    <footer
                        className={`flex w-full ${
                            isFirstQuestion ? `justify-end` : `justify-between`
                        }`}>
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
                                disabled={!canGoNext()}>
                                {MESSAGES.form.next}
                            </button>
                        )}
                        {isLastQuestion && (
                            <Link href={`/form/${formId}/summary`}>
                                <button
                                    className='btn btn-sm'
                                    disabled={!canGoNext()}>
                                    {MESSAGES.form.finish}
                                </button>
                            </Link>
                        )}
                    </footer>
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
