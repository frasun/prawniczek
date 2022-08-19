import { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { withIronSessionSsr } from 'iron-session/next'
import type { NextPageWithLayout } from './_app'
import MESSAGES from '../constants/messages'
import { getFromApi, postToApi } from '../utils/api'
import { sessionOptions } from '../utils/session'
import { signIn } from '../utils/session'
import useUser from '../utils/useUser'
import { getFromStore } from '../utils/storage'
import { FORM } from '../constants/store'
import Alert from '../components/alert'
import LayoutBasic from '../components/layoutBaisc'
import { useRouter } from 'next/router'

interface SignUpVerifyType {
    verified: boolean
    errorMessage?: string
    email?: string
}

const SignUpVerify: NextPageWithLayout<SignUpVerifyType> = ({
    verified,
    errorMessage,
    email,
}) => {
    const { mutateUser } = useUser()
    const [redirectTo, setRedirectTo] = useState<string>('/profile')
    const router = useRouter()

    useEffect(() => {
        const form = getFromStore(FORM)

        if (form?.templateId) {
            setRedirectTo(`/form/${form.templateId}/summary?save=true`)
        }
    }, [])

    async function resendLink() {
        await getFromApi('resendLink', `?email=${email}`)
        router.push('/signup-verify')
    }

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
                <Alert type='error'>
                    <>
                        {errorMessage}
                        {email && (
                            <button
                                className='btn btn-primary btn-sm'
                                onClick={resendLink}>
                                {MESSAGES.auth.resend}
                            </button>
                        )}
                    </>
                </Alert>
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
        errorMessage = null,
        email = null

    if (session.token) {
        verified = true
    } else if (token) {
        const { authToken, message, payload } = await postToApi('magicLogin', {
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

        if (payload) {
            email = payload
        }
    }

    return {
        props: {
            verified,
            errorMessage,
            email,
        },
    }
}, sessionOptions)

SignUpVerify.getLayout = function getLayout(page: ReactElement) {
    return <LayoutBasic>{page}</LayoutBasic>
}
