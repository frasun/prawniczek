import { FC } from 'react'
import { QuestionTypeOptions } from '../utils/types'

export enum InputType {
    text = 'text',
    password = 'password',
}

type ShortTextProps = Pick<QuestionTypeOptions, 'onValueChange' | 'answer'> & {
    type?: InputType
}

const ShortText: FC<ShortTextProps> = ({
    onValueChange,
    answer,
    type = InputType.text,
}) => {
    return (
        <input
            type={type}
            className='input input-bordered w-full'
            spellCheck='false'
            onChange={(e) => {
                onValueChange(e.target.value)
            }}
            defaultValue={answer}
        />
    )
}

export default ShortText
