import { FC } from 'react'
import { QuestionOptions, Answer } from '../utils/types'

type RadioProps = { options: Required<Answer>[] } & Required<
    Pick<QuestionOptions, 'current' | 'onValueChange'>
>

const Radio: FC<RadioProps> = ({ options, current, onValueChange }) => (
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
                        name={current}
                        className='radio'
                        onChange={() => onValueChange(next)}
                    />
                    <span className='label-text ml-4'>{label}</span>
                </label>
            </div>
        ))}
    </fieldset>
)

export default Radio
