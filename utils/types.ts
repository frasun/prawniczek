import { mapResponse } from '../pages/form/[formId]'

export enum ComponentLib {
    shortText = 'short_text',
    longText = 'long_text',
    multipleChoice = 'multiple_choice',
    dropdown = 'dropdown',
    group = 'group',
    statement = 'statement',
    date = 'date',
    thankyou = 'thankyou',
    number = 'number',
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
    variables?: { [key: string]: string }
    documentId?: string
    templateId?: string
}

export type FieldType = {
    ref: string
    title: string
    type: ComponentLib
    properties: { description: string; choices: Choice[]; fields?: FieldType[] }
    validations: {
        required: boolean
    }
    groupId: string
}

export type LogicType = {
    ref: string
    actions: [
        {
            action: string
            details: {
                to: {
                    type: string
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
                vars: LogicVar[]
                op: string
            }
        }
    ]
}

export type LogicVar = {
    type: string
    value: string
    vars?: LogicVar[]
}

export interface FormType {
    formId: string
    form: ReturnType<typeof mapResponse> & {
        documentId?: string
        templateId?: string
    }
    firstQuestionId: string
    answers: FormAnswer[]
}

export type Unarray<T> = T extends Array<infer U> ? U : T

export type QuestionOptions = Unarray<FormType['form']['questions']>

export type SingleChoiceAnswer = Omit<Required<Answer>, 'label'>
export type MultiChoiceAnswer = {
    ref: string
    checked: boolean
    next: string | null
}

export interface QuestionTypeOptions {
    type: ComponentLib
    onValueChange: (
        val: string | SingleChoiceAnswer | MultiChoiceAnswer
    ) => void
    options?: Answer[] | null
    current?: string
    answer?: string | string[]
    validationMessage?: string
}

export type FormTitle = FormType['form']['title']
export type FormQuestions = FormType['form']['questions']

export type FormAnswer = { [x: string]: string | string[] }

export interface Document {
    document_id: string
    title: string
    template: FormTitle
    questions: FormQuestions
    answers: FormAnswer
    created_at: Date
    template_id?: string
    form_id?: string
    document_created: boolean
    summary: {
        question: string
        questionId: string
        answer: string | string[]
        answerId?: string
    }[]
}
