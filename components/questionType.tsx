import { FC } from 'react'
import ShortText from './shortText'
import LongText from './longText'
import MultipleChoice from './multipleChoices'
import Radio from './radio'
import { QuestionOptions, ComponentLib } from '../utils/types'

type ComponentsType = Record<ComponentLib, FC<any>>

const components: ComponentsType = {
    short_text: ShortText,
    long_text: LongText,
    multiple_choice: MultipleChoice,
    dropdown: Radio,
}

function questionType({ type, ...props }: QuestionOptions) {
    const Component = components[type]

    return <Component {...props} />
}

export default questionType
