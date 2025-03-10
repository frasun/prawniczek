import { FC } from 'react'
import Link from 'next/link'
import MESSAGES from '../constants/messages'

export interface FormsType {
    items: [
        {
            title: string
            id: string
        }
    ]
    categoryName?: string
}

const Forms: FC<FormsType> = ({ items }) => (
    <>
        {items.map(({ title, id }) => (
            <div
                className='card w-96 bg-base-100 shadow-xl'
                key={id}>
                <div className='card-body'>
                    <h2 className='card-title'>{title}</h2>
                    <div className='card-actions justify-end'>
                        <Link href={`/form/${id}`}>
                            <button className='btn btn-sm btn-primary mt-6'>
                                {MESSAGES.index.action}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        ))}
    </>
)

export default Forms
