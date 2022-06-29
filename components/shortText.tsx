import { FC } from 'react'
import { QuestionOptions } from '../utils/types'

type ShortTextProps = Pick<QuestionOptions, 'onValueChange'>

const ShortText: FC<ShortTextProps> = ({ onValueChange }) => (
    <input
        type='text'
        className='input input-bordered w-full'
        onChange={(e) => {
            onValueChange(e.target.value.length > 0)
        }}
    />
)

export default ShortText
