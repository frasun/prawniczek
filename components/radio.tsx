import { FC } from 'react'
import { QuestionTypeOptions, Answer } from '../utils/types'

export type RadioProps = { options: Required<Answer>[] } & Required<
    Pick<QuestionTypeOptions, 'current' | 'onValueChange'>
> &
    Pick<QuestionTypeOptions, 'answer'>

const Radio: FC<RadioProps> = ({ options, onValueChange, answer }) => (
    <fieldset>
        {options.map(({ ref, label, next }) => (
            <div
                className='form-control'
                key={ref}>
                <label
                    className='label cursor-pointer justify-start'
                    htmlFor={ref}>
                    <input
                        id={ref}
                        type='radio'
                        className='radio'
                        name='radio'
                        onChange={() => onValueChange({ next, ref })}
                        defaultChecked={answer === ref}
                    />
                    <span className='label-text ml-4'>{label}</span>
                </label>
            </div>
        ))}
    </fieldset>
)

export default Radio
