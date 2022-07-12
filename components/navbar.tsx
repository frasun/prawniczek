import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MESSAGES from '../messages/messages'
import useUser from '../utils/useUser'
import { signOut } from '../utils/session'

const Navbar: FC = () => {
    const { user, mutateUser } = useUser()
    const router = useRouter()
    return (
        <>
            <nav className='navbar bg-primary text-neutral-content sticky top-0 z-10'>
                <div className='navbar-start'>
                    <Link href='/'>
                        <button className='btn btn-ghost normal-case text-xl'>
                            {MESSAGES.global.appName}
                        </button>
                    </Link>
                </div>
                {user?.isLoggedIn && (
                    <div className='navbar-center'>
                        <Link href='/profile'>
                            <button className='btn btn-ghost btn-sm'>
                                {MESSAGES.profile.title}
                            </button>
                        </Link>
                    </div>
                )}
                <div className='navbar-end'>
                    {user?.isLoggedIn === false && (
                        <Link href='/auth'>
                            <button
                                className='btn btn-sm btn-ghost'
                                onClick={() => router.push('/auth')}>
                                {MESSAGES.global.singIn}
                            </button>
                        </Link>
                    )}
                    {user?.isLoggedIn && (
                        <button
                            className='btn btn-sm btn-ghost'
                            onClick={() => mutateUser(signOut())}>
                            {MESSAGES.global.singOut}
                        </button>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar
