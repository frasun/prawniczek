import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '../utils/session'
import MESSAGES from '../messages/messages'

const Profile: FC = () => (
    <>
        <Head>
            <title>
                {MESSAGES.global.appName} - {MESSAGES.profile.title}
            </title>
        </Head>
        <header>
            <h1 className='text-2xl font-bold'>{MESSAGES.profile.title}</h1>
        </header>
        <Link href='/forms'>
            <button className='btn btn-sm btn-primary'>
                {MESSAGES.profile.newDocument}
            </button>
        </Link>
    </>
)

export default Profile

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
}) {
    if (!req.session.user) {
        res.setHeader('location', '/auth')
        res.statusCode = 302
        res.end()
    }
    return {
        props: {},
    }
},
sessionOptions)
