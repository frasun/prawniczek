import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import { withIronSessionSsr } from 'iron-session/next'
import MESSAGES from '../constants/messages'
import { postToApi } from '../utils/api'
import { sessionOptions } from '../utils/session'
import { signIn } from '../utils/session'
import useUser from '../utils/useUser'
import { getFromStore } from '../utils/storage'
import { FORM } from '../constants/store'

interface SignUpVerify {
    verified: boolean
    errorMessage?: string
}

const SignUpVerify: FC<SignUpVerify> = ({ verified, errorMessage }) => {
    const { mutateUser } = useUser()
    const [redirectTo, setRedirectTo] = useState<string>('/profile')

    useEffect(() => {
        const { templateId } = getFromStore(FORM)

        if (templateId) {
            setRedirectTo(`/form/${templateId}/summary?save=true`)
        }
    }, [])

    return (
        <>
            <Head>
                <title>
                    {MESSAGES.global.appName} - {MESSAGES.global.singUp}
                </title>
            </Head>
            {verified ? (
                <div className='alert alert-success shadow-lg'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='stroke-current flex-shrink-0 h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    {MESSAGES.auth.verified}
                    <button
                        className='btn btn-primary btn-sm'
                        onClick={() =>
                            mutateUser(signIn(undefined, undefined, redirectTo))
                        }>
                        {MESSAGES.global.singIn}
                    </button>
                </div>
            ) : errorMessage ? (
                <div className='alert alert-error shadow-lg'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='stroke-current flex-shrink-0 h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    {errorMessage}
                </div>
            ) : (
                <div className='alert shadow-lg'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        className='stroke-info flex-shrink-0 w-6 h-6'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                    </svg>
                    {MESSAGES.auth.verify}
                </div>
            )}
        </>
    )
}

export default SignUpVerify

export const getServerSideProps = withIronSessionSsr(async ({ req, query }) => {
    const { token } = query
    const { session } = await req
    let verified = false,
        errorMessage = null

    if (session.token) {
        verified = true
    } else if (token) {
        const { authToken, message } = await postToApi('magicLogin', {
            magic_token: token,
        })

        if (authToken) {
            session.token = authToken
            await session.save()
            verified = true
        }

        if (message) {
            errorMessage = message
        }
    }

    return {
        props: {
            verified,
            errorMessage,
        },
    }
}, sessionOptions)
