import { useState, FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MESSAGES from '../constants/messages'
import ShortText, { InputType } from '../components/shortText'
import { signUp } from '../utils/session'

const Register: FC = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const router = useRouter()

    return (
        <>
            <Head>
                <title>
                    {MESSAGES.global.appName} - {MESSAGES.global.singUp}
                </title>
            </Head>
            <header>
                <h1 className='text-2xl font-bold'>{MESSAGES.global.singUp}</h1>
            </header>
            <fieldset className='w-full'>
                <div className='form-control w-full'>
                    <label className='label'>
                        <span className='label-text'>{MESSAGES.auth.name}</span>
                    </label>
                    <ShortText
                        onValueChange={(val) => setName(val as string)}
                    />
                </div>
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
                            signUp(name, username, password, '/signup-verify')
                        }>
                        {MESSAGES.global.singUp}
                    </button>
                    <Link href='/signin'>
                        <button
                            className='btn btn-sm btn-ghost ml-3'
                            onClick={() => router.push('/signin')}>
                            {MESSAGES.global.singIn}
                        </button>
                    </Link>
                </footer>
            </fieldset>
        </>
    )
}

export default Register
