import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import MESSAGES from '../../constants/messages'
import { getFromApi } from '../../utils/api'
import Forms, { FormsType } from '../../components/forms'

const Form: FC<FormsType> = ({ items, categoryName }) => {
    const pageTitle = `${MESSAGES.global.appName} - ${categoryName}`
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <h1 className='text-4xl font-bold'>{categoryName}</h1>
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

export const getServerSideProps: GetServerSideProps = async (router) => {
    const { categoryId } = router.query
    const { items }: FormsType = await getFromApi('forms', `/${categoryId}`)
    const { name: categoryName } = await getFromApi(
        'category',
        `/${categoryId}`
    )

    return {
        props: {
            items,
            categoryName,
        },
    }
}
