import {
    FormAnswer,
    FormQuestions,
    Document,
    FormType,
    LogicVar,
} from './types'
import { getFromStore } from './storage'
import { FORM, ANSWERS } from '../constants/store'

export default function getSummary(
    questions: FormQuestions,
    answers: FormAnswer
): Document['summary'] {
    let nextQuestion: string | null = questions[0].id
    const summary = []

    while (nextQuestion) {
        const currentQuestion = questions.find(({ id }) => id === nextQuestion)

        if (currentQuestion) {
            const { options, title, id } = currentQuestion
            let answerLabel: string | string[] = ''

            if (answers.hasOwnProperty(nextQuestion)) {
                const currentAnswer = answers[nextQuestion]
                const hasOptions = Array.isArray(options)

                if (hasOptions) {
                    if (Array.isArray(currentAnswer)) {
                        answerLabel = currentAnswer.map((answer) => {
                            const a = options.find(
                                (option) => option.ref === answer
                            )
                            return a?.label || ''
                        })
                    } else {
                        const selectedOption = options.find(
                            (option) => option.ref === currentAnswer
                        )
                        if (selectedOption) {
                            answerLabel = selectedOption.label
                        }
                    }
                } else {
                    answerLabel = currentAnswer
                }

                summary.push({
                    question: title,
                    answer: answerLabel,
                })
            }

            nextQuestion = getNextId(id)
        }
    }

    return summary
}

export function getNextId(questionId: string) {
    const answers = getFromStore(ANSWERS)[questionId]
    const questions: FormType['form']['questions'] =
        getFromStore(FORM).questions

    const questionIndex =
        questions && questions.findIndex(({ id }) => id === questionId)
    const { logic } = questions[questionIndex]

    const actions = logic ? logic.actions : null
    let nextQuestion = null
    const nextQuestionItem =
        questionIndex < questions.length - 1
            ? questions[questionIndex + 1].id
            : null

    if (actions) {
        const jumpActions = actions.filter(({ action }) => action === 'jump')

        for (let action of jumpActions) {
            const {
                details: {
                    to: { type, value },
                },
                condition: { op, vars },
            } = action

            switch (op) {
                case 'is': {
                    if (answers) {
                        const nextAction = findChoice(vars, answers)
                        nextQuestion = nextAction ? value : null
                    }
                    break
                }
                case 'is_not': {
                    if (answers) {
                        const nextAction = findChoice(vars, answers)
                        nextQuestion = nextAction ? null : value
                    }
                    break
                }
                case 'or': {
                    if (answers) {
                        const nextAction = vars.find(({ vars }) => {
                            if (vars) {
                                return findChoice(vars, answers)
                            }

                            return false
                        })

                        nextQuestion = nextAction ? value : null
                    }
                    break
                }
                case 'always': {
                    nextQuestion = type !== 'thankyou' ? value : null
                    break
                }
                default:
                    break
            }

            if (nextQuestion) {
                break
            } else if (!answers) {
                nextQuestion = nextQuestionItem
            }
        }
    } else {
        nextQuestion = nextQuestionItem
    }

    return nextQuestion
}

function findChoice(vars: LogicVar[], answers: string | string[]) {
    return typeof answers !== 'undefined'
        ? vars.find(
              ({ type, value }) => type === 'choice' && answers.includes(value)
          )
        : undefined
}
