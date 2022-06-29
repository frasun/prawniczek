import { FC } from 'react'
import { QuestionOptions } from '../utils/types'

type LongTextProps = Pick<QuestionOptions, 'onValueChange'>

const LongText: FC<LongTextProps> = ({ onValueChange }) => (
    <textarea
        className='textarea textarea-bordered w-full'
        onChange={(e) => {
            onValueChange(e.target.value.length > 0)
        }}></textarea>
)

export default LongText
