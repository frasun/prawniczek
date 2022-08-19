import { FC } from 'react'
import { QuestionTypeOptions } from '../utils/types'

export type MultipleChoiceProps = Required<
    Pick<QuestionTypeOptions, 'options' | 'onValueChange'>
> &
    Pick<QuestionTypeOptions, 'answer'>

const MultipleChoice: FC<MultipleChoiceProps> = ({
    options,
    onValueChange,
    answer,
}) => {
    const answers = Array.isArray(answer) ? answer : []

    return (
        <fieldset>
            {options &&
                options.map(({ ref, label }) => (
                    <div
                        className='form-control'
                        key={ref}>
                        <label className='label cursor-pointer justify-start'>
                            <input
                                type='checkbox'
                                className='checkbox'
                                defaultChecked={answers.includes(ref)}
                                onChange={(e) =>
                                    onValueChange({
                                        ref,
                                        checked: e.target.checked,
                                    })
                                }
                            />
                            <span className='label-text ml-4'>{label}</span>
                        </label>
                    </div>
                ))}
        </fieldset>
    )
}

export default MultipleChoice
