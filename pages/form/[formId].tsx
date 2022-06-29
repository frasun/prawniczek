import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import MESSAGES from '../../messages/messages'
import { getFromApi } from '../../utils/api'

interface FormProps {
    id: string
    title: string
    firstQuestionId: string
}

interface FormResponse {
    title: string
    fields: [{ ref: string }]
    id: string
}

const Form: FC<FormProps> = ({ id, title, firstQuestionId }) => (
    <>
        <Head>
            <title>
                {MESSAGES.global.appName} - {title}
            </title>
        </Head>
        <h1>{title}</h1>
        <Link href={`/form/${id}/${firstQuestionId}`}>
            <button className='btn btn-primary mt-6'>
                {MESSAGES.index.action}
            </button>
        </Link>
    </>
)

export default Form

export const getServerSideProps: GetServerSideProps = async (router) => {
    const { formId } = router.query
    const { title, fields, id }: FormResponse = await getFromApi('form', formId)

    return {
        props: {
            id,
            title,
            firstQuestionId: fields[0].ref,
        },
    }
}
