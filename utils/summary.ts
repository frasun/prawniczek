import {
    ComponentLib,
    QuestionOptions,
    FormAnswer,
    FormQuestions,
} from './types'

const textFields = [ComponentLib.shortText, ComponentLib.longText]

export default function getItems(
    questions: FormQuestions,
    answers: FormAnswer[]
) {
    const answerIds = answers.map((answer) => answer[0])
    const filteredQuestions = questions.filter(({ id }) =>
        answerIds.includes(id)
    )

    const items = filteredQuestions.map(({ options, type, title, id }) => {
        const answerIndex = answerIds.findIndex((answer) => answer === id)
        const value = answers[answerIndex][1]

        const answer = textFields.includes(type)
            ? value
            : Array.isArray(value)
            ? value.map((val) => getChoiceAnswer(val, options))
            : getChoiceAnswer(value, options)

        return {
            question: title,
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
