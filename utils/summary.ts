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
