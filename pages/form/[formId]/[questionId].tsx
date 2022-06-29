import { useState, FC } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import styled from 'styled-components'

import { getFromApi } from '../../../utils/api'
import QuestionType from '../../../components/questionType'
import Breadcrums from '../../../components/breadcrumbs'
import MESSAGES from '../../../messages/messages'

import {
    ComponentLib,
    Answer,
    FormResponse,
    Question as QuestionT,
} from '../../../utils/types'

const Footer = styled.nav.attrs(() => ({
    className: `flex w-full`,
}))`
    justify-content: flex-end;
    &[data-spaced='true'] {
        justify-content: space-between;
    }
`

const Question: FC<QuestionT> = ({
    formId,
    title,
    questionType,
    currentQuestionId,
    nextQuestionId,
    firstQuestion,
    required,
    description,
    choices,
    formTitle,
}) => {
    const [isFilled, setIsFilled] = useState(false)
    const [nextId, setNextId] = useState(nextQuestionId)
    const router = useRouter()

    function handleValueChange(val: string | boolean) {
        if (
            questionType === ComponentLib['dropdown'] &&
            typeof val === 'string'
        ) {
            setNextId(val)
        }
        setIsFilled(true)
    }

    return (
        <>
            <Head>
                <title>
                    {MESSAGES.global.appName} - {formTitle}
                </title>
            </Head>

            <Breadcrums items={[formTitle]} />
            <header>
                <h1 className='text-2xl font-bold'>{title}</h1>
                {description && <p>{description}</p>}
            </header>
            <QuestionType
                type={questionType}
                options={choices}
                current={currentQuestionId}
                onValueChange={handleValueChange}
            />
            <Footer data-spaced={!firstQuestion}>
                {!firstQuestion && (
                    <button
                        className='btn btn-sm'
                        onClick={() => router.back()}>
                        {MESSAGES.form.back}
                    </button>
                )}
                {nextId !== null && (
                    <Link href={`/form/${formId}/${nextId}`}>
                        <button
                            className='btn btn-sm'
                            disabled={
                                (required && !isFilled) ||
                                typeof nextId === 'number'
                            }>
                            {MESSAGES.form.next}
                        </button>
                    </Link>
                )}
            </Footer>
        </>
    )
}

export default Question

export const getServerSideProps: GetServerSideProps = async (router) => {
    const { formId, questionId: currentQuestionId } = router.query
    const {
        fields,
        logic,
        title: formTitle,
    }: FormResponse = await getFromApi('form', formId)

    const currentQuestionIndex = fields.findIndex(
        (el) => el.ref === currentQuestionId
    )
    const currentQuestion = fields[currentQuestionIndex]

    const {
        title,
        type: questionType,
        properties: { description, choices },
        validations: { required },
    } = currentQuestion

    let nextQuestion,
        nextQuestionId = null,
        answers: Answer[] = []

    const elementWithLogic = logic.find((el) => el.ref === currentQuestionId)

    if (elementWithLogic) {
        if (choices) {
            answers = choices.map((choice) => {
                const nextQuestion = elementWithLogic.actions.find((el) =>
                    el.condition.vars.find((item) => item.value === choice.ref)
                )
                const nextId = nextQuestion
                    ? nextQuestion.details.to.value
                    : undefined
                return {
                    next: nextId,
                    ...choice,
                }
            })
            nextQuestionId = -1
        } else {
            nextQuestionId = elementWithLogic.actions[0].details.to.value
        }
    } else {
        answers = choices || []
        nextQuestion = fields[currentQuestionIndex + 1]
        nextQuestionId = nextQuestion ? nextQuestion.ref : null
    }

    return {
        props: {
            formId,
            title,
            questionType,
            currentQuestionId,
            nextQuestionId,
            firstQuestion: currentQuestionIndex === 0,
            required,
            description: description || null,
            choices: answers,
            formTitle,
        },
    }
}
