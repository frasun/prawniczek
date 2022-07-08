import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getFromApi } from '../../utils/api'
import MESSAGES from '../../messages/messages'
import { FormResponse, LogicType, FormType } from '../../utils/types'

const Form: FC<FormType> = ({ formId, form, firstQuestionId }) => {
    const router = useRouter()

    useEffect(() => {
        sessionStorage.setItem('form', JSON.stringify(form))
        sessionStorage.setItem('formAnswers', JSON.stringify({}))

        router.push(`${formId}/${firstQuestionId}`)
    })

    return <progress className='progress'></progress>
}

export default Form

export const getServerSideProps: GetServerSideProps = async (router) => {
    const { formId } = router.query
    const { title, fields, logic }: FormResponse = await getFromApi(
        'forms',
        formId
    )

    return {
        props: {
            formId,
            form: mapResponse({ title, fields, logic }),
            firstQuestionId: fields[0].ref,
        },
    }
}

export function mapResponse({ title, fields, logic }: FormResponse) {
    return {
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
    const jumpAction = el.actions.find(({ action }) => action === 'jump')

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

function hasLogic(logic: LogicType[], questionRef: string): LogicType {
    return logic.find(({ ref }) => ref === questionRef)!
}

function getValidator(logic: LogicType[], id: string) {
    const el = hasLogic(logic, id)
    const setAction = el.actions.find(
        ({ action, details }) =>
            action === 'set' &&
            details.target &&
            details.target.value === 'validation'
    )

    return setAction ? setAction.details.value.value : null
}
