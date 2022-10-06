import ShortText, { InputType, ShortTextProps } from './shortText'
import LongText, { LongTextProps } from './longText'
import MultipleChoice, { MultipleChoiceProps } from './multipleChoices'
import Radio, { RadioProps } from './radio'
import { ComponentLib, QuestionTypeOptions } from '../utils/types'

function questionType({
    type,
    validationMessage,
    ...props
}: QuestionTypeOptions) {
    const component = getComponent(type)

    function getComponent(Ctype: ComponentLib) {
        switch (Ctype) {
            case 'short_text':
                return (
                    <ShortText
                        {...(props as ShortTextProps)}
                        type={InputType.text}
                    />
                )
            case 'date':
                return (
                    <ShortText
                        {...(props as ShortTextProps)}
                        type={InputType.date}
                    />
                )
            case 'number':
                return (
                    <ShortText
                        {...(props as ShortTextProps)}
                        type={InputType.number}
                    />
                )
            case 'long_text':
                return <LongText {...(props as LongTextProps)} />
            case 'multiple_choice':
                return <MultipleChoice {...(props as MultipleChoiceProps)} />
            case 'dropdown':
                return <Radio {...(props as RadioProps)} />
            case 'group':
            case 'statement':
            default:
                return null
        }
    }

    return (
        <>
            {component ? (
                <div
                    className={`w-full${
                        validationMessage
                            ? ' tooltip tooltip-error tooltip-bottom tooltip-open'
                            : ''
                    }`}
                    data-tip={
                        validationMessage ? validationMessage : undefined
                    }>
                    {component}
                </div>
            ) : null}
        </>
    )
}

export default questionType
