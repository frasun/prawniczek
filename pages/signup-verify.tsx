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
import Alert from '../components/alert'

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
                <Alert type='success'>
                    <>
                        {MESSAGES.auth.verified}
                        <button
                            className='btn btn-primary btn-sm'
                            onClick={() =>
                                mutateUser(
                                    signIn(undefined, undefined, redirectTo)
                                )
                            }>
                            {MESSAGES.global.singIn}
                        </button>
                    </>
                </Alert>
            ) : errorMessage ? (
                <Alert type='error'>{errorMessage}</Alert>
            ) : (
                <Alert>{MESSAGES.auth.verify}</Alert>
            )}
        </>
    )
}

export default SignUpVerify

export const getServerSideProps = withIronSessionSsr(async ({ req, query }) => {
    const { token } = query
    const { session } = req
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
