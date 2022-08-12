import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MESSAGES from '../constants/messages'
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
                        <>
                            <span>{user.name}</span>
                            <Link href='/profile'>
                                <button className='btn btn-ghost btn-sm ml-2'>
                                    {MESSAGES.profile.title}
                                </button>
                            </Link>
                            <button
                                className='btn btn-sm btn-ghost ml-2'
                                onClick={() => mutateUser(signOut())}>
                                {MESSAGES.global.singOut}
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar
