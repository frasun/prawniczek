import { FC } from 'react'
import { QuestionTypeOptions } from '../utils/types'

type ShortTextProps = Pick<QuestionTypeOptions, 'onValueChange' | 'answer'>

const ShortText: FC<ShortTextProps> = ({ onValueChange, answer }) => (
    <input
        type='text'
        className='input input-bordered w-full'
        spellCheck='false'
        onChange={(e) => {
            onValueChange(e.target.value)
        }}
        defaultValue={answer}
    />
)

export default ShortText
