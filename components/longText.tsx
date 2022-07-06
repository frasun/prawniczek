import { FC } from 'react'
import { QuestionTypeOptions } from '../utils/types'

type LongTextProps = Pick<QuestionTypeOptions, 'onValueChange' | 'answer'>

const LongText: FC<LongTextProps> = ({ onValueChange, answer }) => (
    <textarea
        className='textarea textarea-bordered w-full'
        spellCheck='false'
        defaultValue={answer}
        onChange={(e) => {
            onValueChange(e.target.value)
        }}></textarea>
)

export default LongText
