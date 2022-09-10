import MESSAGES from '../constants/messages'
import { FormAnswer, FormQuestions, Document } from './types'

export default function getSummary(
    questions: FormQuestions,
    answers: FormAnswer
): Document['summary'] {
    let nextQuestion: string = questions[0].id
    const summary = []

    while (nextQuestion !== MESSAGES.form.last) {
        const currentQuestion = questions.find(({ id }) => id === nextQuestion)

        if (currentQuestion) {
            const { options, next, title } = currentQuestion
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
                        nextQuestion = next || MESSAGES.form.last
                    } else {
                        const selectedOption = options.find(
                            (option) => option.ref === currentAnswer
                        )
                        if (selectedOption) {
                            answerLabel = selectedOption.label
                            nextQuestion = next || selectedOption.next
                        }
                    }
                } else {
                    nextQuestion = next || MESSAGES.form.last
                    answerLabel = currentAnswer
                }

                summary.push({
                    question: title,
                    answer: answerLabel,
                })
            } else {
                nextQuestion = MESSAGES.form.last
            }
        }
    }

    return summary
}
