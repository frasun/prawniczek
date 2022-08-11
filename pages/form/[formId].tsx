import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../../utils/session'
import { getFromApi } from '../../utils/api'
import MESSAGES from '../../constants/messages'
import { FormResponse, LogicType, FormType, Document } from '../../utils/types'

const Form: FC<FormType> = ({ formId, form, firstQuestionId, answers }) => {
    const router = useRouter()

    useEffect(() => {
        sessionStorage.setItem('form', JSON.stringify(form))
        sessionStorage.setItem('formAnswers', JSON.stringify(answers))

        router.push(`${formId}/${firstQuestionId}`)
    })

    return <progress className='progress'></progress>
}

export default Form

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
    async ({ req, query }) => {
        const { token } = req.session
        const { formId } = query
        let documentId,
            answers = {}
        let document: Document

        if (token) {
            document = await getFromApi('document', formId, token)
            if (document.answers) {
                documentId = document.template_id
                answers = document.answers
            }
        }

        const form: FormResponse = await getFromApi(
            'form',
            documentId ? documentId : formId
        )
        const { title, fields, logic } = form

        return {
            props: {
                formId,
                form: mapResponse({ title, fields, logic, documentId }),
                firstQuestionId: fields[0].ref,
                answers,
            },
        }
    },
    sessionOptions
)

export function mapResponse({
    title,
    fields,
    logic,
    documentId,
}: FormResponse) {
    return {
        documentId: documentId || null,
        formTitle: title,
        questions: fields.map(
            (
                {
                    ref: id,
                    title,
                    type,
                    validations: { required },
                    properties: { choices, description },
                },
                index: number,
                fields
            ) => {
                const options = choices
                    ? choices.map(({ ref, label }) => ({
                          ref,
                          label,
                          next: getNextQuestionForChoice(ref, id, logic),
                      }))
                    : null

                return {
                    id,
                    title,
                    type,
                    required,
                    options,
                    description: description || null,
                    next: hasLogic(logic, id)
                        ? choices
                            ? null
                            : getNextQuestion(id, logic)
                        : fields[index + 1]
                        ? fields[index + 1].ref
                        : null,
                    validation: hasLogic(logic, id)
                        ? getValidator(logic, id)
                        : null,
                }
            }
        ),
    }
}

function getNextQuestion(
    questionRef: string,
    logic: LogicType[]
): string | null {
    const el = hasLogic(logic, questionRef)
    const jumpAction = el && el.actions.find(({ action }) => action === 'jump')

    return jumpAction ? jumpAction.details.to.value : null
}

function getNextQuestionForChoice(
    choiceRef: string,
    questionRef: string,
    logic: LogicType[]
) {
    const fieldWithLogic = hasLogic(logic, questionRef)

    return fieldWithLogic
        ? getLogicItem(fieldWithLogic, choiceRef)
            ? getLogicItem(fieldWithLogic, choiceRef).details.to.value
            : MESSAGES.form.last
        : MESSAGES.form.last
}

function getLogicItem(fieldWithLogic: LogicType, choiceRef: string) {
    return fieldWithLogic.actions.find(({ condition: { vars } }) =>
        vars.find(({ value }) => value === choiceRef)
    )!
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
