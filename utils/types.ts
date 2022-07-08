import { mapResponse } from "../pages/form/[formId]"

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
    next?: string | null
}

export interface Question {
    formId: string
    title: string
    questionType: ComponentLib
    questionId: string
    nextQuestionId: string
    firstQuestion: string
    required: boolean
    description: string
    choices: Answer[]
    formTitle: string
}

export interface FormResponse {
    title: string
    fields: FieldType[]
    logic: LogicType[]
}

export type FieldType = {
    ref: string
    title: string
    type: ComponentLib
    properties: { description: string; choices: Choice[] }
    validations: {
        required: boolean
    }
}

export type LogicType = {
    ref: string
    actions: [
        {
            action: string            
            details: {
                to: {
                    value: string
                }
                target: {
                    value: string
                }
                value: {
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

export interface FormType {
    formId: string
    form: ReturnType<typeof mapResponse>
    firstQuestionId: string
}

export type Unarray<T> = T extends Array<infer U> ? U : T

export type QuestionOptions = Unarray<FormType['form']['questions']>

export type SingleChoiceAnswer = Omit<Required<Answer>,'label'>
export type MultiChoiceAnswer = { ref: string; checked: boolean }

export interface QuestionTypeOptions {
    type: ComponentLib
    onValueChange: (val: string|SingleChoiceAnswer|MultiChoiceAnswer) => void
    options?: Answer[] | null
    current?: string,
    answer?: string | string[]
}

export type FormTitle = FormType['form']['formTitle']