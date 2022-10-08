import { FormQuestions, Document } from './types'

type Variables = Record<string, string>

export default function getDocument(
    paragraphs: FormQuestions,
    variables: Variables,
    summary: Document['summary']
) {
    const contents: string[] = []
    const variableContents: Variables = {}

    let nextQuestion: string | null = paragraphs[0].id

    for (let [key, value] of Object.entries(variables)) {
        const summaryItem = summary.find(
            ({ questionId }) => questionId === value
        )
        variableContents[key] = summaryItem
            ? summaryItem.answerId || String(summaryItem.answer)
            : ''
    }

    while (nextQuestion) {
        const currentIndex = paragraphs.findIndex(
            ({ id }) => id === nextQuestion
        )
        const { logic, title } = paragraphs[currentIndex]
        const varsRegExp = /{{var:(.*?)}}/g
        const paragraph = title.replace(varsRegExp, (matched) =>
            getVariable(matched, variables, summary)
        )

        contents.push(paragraph)
        nextQuestion = null

        if (logic) {
            const { actions } = logic
            const jumpActions = actions.filter(
                ({ action }) => action === 'jump'
            )

            for (let actionItem of jumpActions) {
                const {
                    details: {
                        to: { type, value },
                    },
                    condition: { op, vars },
                } = actionItem

                switch (op) {
                    case 'equal':
                    case 'not_equal':
                        const varName = vars.find(
                            ({ type }) => type === 'variable'
                        )
                        const varValue = vars.find(
                            ({ type }) => type === 'constant'
                        )

                        if (varName && varValue) {
                            const variable = variableContents[varName.value]

                            if (op === 'equal') {
                                if (variable === varValue.value) {
                                    nextQuestion = value
                                }
                            } else {
                                if (variable !== varValue.value) {
                                    nextQuestion = value
                                }
                            }
                        }

                        break
                    case 'always': {
                        nextQuestion = type !== 'thankyou' ? value : null
                        break
                    }
                    default:
                        break
                }

                if (nextQuestion) {
                    break
                }
            }
        } else if (currentIndex < paragraphs.length - 1) {
            nextQuestion = paragraphs[currentIndex + 1].id
        }
    }

    return contents
}

function getVariable(
    matched: string,
    variables: Variables,
    summary: Document['summary']
) {
    const varName = matched.replace('{{var:', '').replace('}}', '')
    const question = summary.find(
        ({ questionId }) => questionId === variables[varName]
    )

    return question ? String(question.answer) : ''
}
