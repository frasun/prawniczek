import { FC } from 'react'
import { QuestionOptions } from '../utils/types'

type MultipleChoiceProps = Required<
    Pick<QuestionOptions, 'options' | 'onValueChange'>
>

const MultipleChoice: FC<MultipleChoiceProps> = ({
    options,
    onValueChange,
}) => (
    <fieldset>
        {options.map(({ ref, label }) => (
            <div
                className='form-control'
                key={ref}>
                <label className='label cursor-pointer justify-start'>
                    <input
                        type='checkbox'
                        className='checkbox'
                        defaultChecked={false}
                        onChange={(e) => onValueChange(e.target.checked)}
                    />
                    <span className='label-text ml-4'>{label}</span>
                </label>
            </div>
        ))}
    </fieldset>
)

export default MultipleChoice
