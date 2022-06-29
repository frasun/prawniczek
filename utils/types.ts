export enum ComponentLib {
    shortText = 'short_text',
    longText = 'long_text',
    multipleChoice = 'multiple_choice',
    dropdown = 'dropdown',
}

export type Choice = {
    ref: string
    label: string
}

export interface Answer extends Choice {
    next?: string
}

export interface QuestionOptions {
    type: ComponentLib
    onValueChange: (val: string|boolean) => void
    options?: Answer[]
    current?: string
}

export interface Question {
    formId: string
    title: string
    questionType: ComponentLib
    currentQuestionId: string
    nextQuestionId: string
    firstQuestion: string
    required: boolean
    description: string
    choices: Answer[]
    formTitle: string
}

export interface FormResponse {
    title: string
    fields: [
        {
            ref: string
            title: string
            type: ComponentLib
            properties: { description: string; choices: Choice[] }
            validations: {
                required: boolean
            }
        }
    ]
    logic: [
        {
            ref: string
            actions: [
                {
                    details: {
                        to: {
                            value: string
                        }
                    }
                    condition: {
                        vars: [
                            {
                                value: string
                            }
                        ]
                    }
                }
            ]
        }
    ]
}