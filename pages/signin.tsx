import { useState, FC, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MESSAGES from '../constants/messages'
import ShortText, { InputType } from '../components/shortText'
import { signIn } from '../utils/session'
import useUser from '../utils/useUser'

const SignIn: FC = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { mutateUser } = useUser()
    const router = useRouter()
    const redirectTo = router.query.redirect
        ? {
              pathname: String(router.query.redirect),
              query: { save: router.query.save, draft: router.query.draft },
          }
        : '/profile'

    useEffect(() => {
        router.prefetch('/profile')
    }, [router])

    return (
        <>
            <Head>
                <title>
                    {MESSAGES.global.appName} - {MESSAGES.global.singIn}
                </title>
            </Head>
            <header>
                <h1 className='text-2xl font-bold'>{MESSAGES.global.singIn}</h1>
            </header>
            <fieldset className='w-full'>
                <div className='form-control w-full'>
                    <label className='label'>
                        <span className='label-text'>
                            {MESSAGES.auth.email}
                        </span>
                    </label>
                    <ShortText
                        onValueChange={(val) => setUsername(val as string)}
                    />
                </div>
                <div className='form-control w-full'>
                    <label className='label'>
                        <span className='label-text'>
                            {MESSAGES.auth.password}
                        </span>
                    </label>
                    <ShortText
                        onValueChange={(val) => setPassword(val as string)}
                        type={InputType.password}
                    />
                </div>
                <footer className='mt-6'>
                    <button
                        className='btn btn-primary'
                        onClick={() =>
                            mutateUser(signIn(username, password, redirectTo))
                        }>
                        {MESSAGES.global.singIn}
                    </button>
                    <Link href='/signup'>
                        <button
                            className='btn btn-sm btn-ghost ml-3'
                            onClick={() => router.push('/signup')}>
                            {MESSAGES.global.singUp}
                        </button>
                    </Link>
                </footer>
            </fieldset>
        </>
    )
}

export default SignIn
