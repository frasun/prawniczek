import ShortText, { ShortTextProps } from './shortText'
import LongText, { LongTextProps } from './longText'
import MultipleChoice, { MultipleChoiceProps } from './multipleChoices'
import Radio, { RadioProps } from './radio'
import { QuestionTypeOptions } from '../utils/types'

function questionType({ type, ...props }: QuestionTypeOptions) {
    switch (type) {
        case 'short_text':
            return <ShortText {...(props as ShortTextProps)} />
        case 'long_text':
            return <LongText {...(props as LongTextProps)} />
        case 'multiple_choice':
            return <MultipleChoice {...(props as MultipleChoiceProps)} />
        default:
            return <Radio {...(props as RadioProps)} />
    }
}

export default questionType
