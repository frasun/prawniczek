import { FC } from 'react'
import Head from 'next/head'
import MESSAGES from '../messages/messages'

const Profile: FC = () => {
    return (
        <>
            <Head>
                <title>
                    {MESSAGES.global.appName} - {MESSAGES.global.singIn}
                </title>
            </Head>
            <header>
                <h1 className='text-2xl font-bold'>{MESSAGES.profile.title}</h1>
            </header>
        </>
    )
}

export default Profile
