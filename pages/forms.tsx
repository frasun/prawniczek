import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import MESSAGES from '../messages/messages'
import { getFromApi } from '../utils/api'

interface Forms {
    items: [
        {
            title: string
            id: string
        }
    ]
}

const Form: FC<Forms> = ({ items }) => (
    <>
        <Head>
            <title>{MESSAGES.global.appName}</title>
        </Head>
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

export default Form

export const getServerSideProps: GetServerSideProps = async () => {
    const { items }: Forms = await getFromApi('forms')

    return {
        props: {
            items,
        },
    }
}
