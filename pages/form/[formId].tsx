import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../utils/session'
import { getFromApi } from '../../utils/api'
import {
    FormResponse,
    LogicType,
    FormType,
    Document,
    ComponentLib,
} from '../../utils/types'

const Form: FC<FormType> = ({ formId, form, firstQuestionId, answers }) => {
    const router = useRouter()

    useEffect(() => {
        const docId = form.documentId ?? formId

        localStorage.setItem('form', JSON.stringify(form))
        localStorage.setItem('formAnswers', JSON.stringify(answers))

        router.replace(`${docId}/${firstQuestionId}`)
    })

    return <progress className='progress'></progress>
}

export default Form

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
    async ({ req, res, query }) => {
        const { token } = req.session
        const { formId } = query
        let documentId,
            templateId = String(formId),
            answers = {},
            document: Document

        if (token) {
            document = await getFromApi('document', `/${formId}`, token)
            if (document.created_at) {
                documentId = String(formId)
                templateId = String(document.template_id)
                answers = document.answers
            }
        }

        const form: FormResponse = await getFromApi('form', `/${templateId}`)

        if (!form.fields) {
            res.setHeader('location', `/signin?redirect=form/${formId}`)
            res.statusCode = 302
            res.end()
        }

        return {
            props: {
                formId: templateId,
                form: {
                    documentId: documentId || null,
                    templateId,
                    variables: form.variables || null,
                    ...mapFormResponse(form),
                },
                firstQuestionId: form.fields[0].ref,
                answers,
            },
        }
    },
    sessionOptions
)

export function mapFormResponse(form: FormResponse) {
    const { fields, title, logic } = form

    let groupFields: FormResponse['fields'] = []
    for (const field of fields) {
        groupFields.push(field)

        if (field.type === ComponentLib.group) {
            const subFields = field.properties.fields
            if (subFields?.length) {
                groupFields = groupFields.concat(subFields)
            }
        }
    }

    return {
        ...mapResponse({
            title,
            fields: groupFields,
            logic,
        }),
    }
}

export function mapResponse({ title, fields, logic }: FormResponse) {
    return {
        title,
        questions: fields.map(
            ({
                ref: id,
                title,
                type,
                validations,
                properties: { choices, description },
            }) => {
                const options = choices
                    ? choices.map(({ ref, label }) => ({
                          ref,
                          label,
                      }))
                    : null

                return {
                    id,
                    title,
                    type,
                    required: validations ? validations.required : false,
                    options,
                    description: description || null,
                    validation: hasLogic(logic, id)
                        ? getValidator(logic, id)
                        : null,
                    logic: hasLogic(logic, id) ? hasLogic(logic, id) : null,
                }
            }
        ),
    }
}

function hasLogic(
    logic: LogicType[] | undefined,
    questionRef: string
): LogicType | undefined {
    return logic ? logic.find(({ ref }) => ref === questionRef) : undefined
}

function getValidator(logic: LogicType[], id: string) {
    const el = hasLogic(logic, id)
    const setAction =
        el &&
        el.actions.find(
            ({ action, details }) =>
                action === 'set' &&
                details.target &&
                details.target.value === 'validation'
        )

    return setAction ? setAction.details.value.value : null
}
