import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import MESSAGES from '../constants/messages'
import { getFromApi } from '../utils/api'
import Forms, { FormsType } from '../components/forms'

const Form: FC<FormsType> = ({ items }) => {
    const pageTitle = `${MESSAGES.global.appName} - ${MESSAGES.forms.pageTitle}`
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <h1 className='text-4xl font-bold'>{MESSAGES.forms.pageTitle}</h1>
            <Forms items={items} />
            <Link href='/'>
                <button className='btn btn-sm btn-primary mt-6'>
                    {MESSAGES.forms.back}
                </button>
            </Link>
        </>
    )
}

export default Form

export const getServerSideProps: GetServerSideProps = async () => {
    const { items }: FormsType = await getFromApi('forms')

    return {
        props: {
            items,
        },
    }
}
