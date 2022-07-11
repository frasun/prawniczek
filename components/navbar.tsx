import { FC } from 'react'
import Link from 'next/link'
import MESSAGES from '../messages/messages'

import { useSession, signOut } from 'next-auth/react'

const Navbar: FC = () => {
    const { data: session } = useSession()

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
                {session && (
                    <div className='navbar-center'>
                        <Link href='/profile'>
                            <button className='btn btn-ghost btn-sm'>
                                {MESSAGES.profile.title}
                            </button>
                        </Link>
                    </div>
                )}
                <div className='navbar-end'>
                    {!session ? (
                        <Link href='/auth'>
                            <button className='btn btn-sm btn-ghost'>
                                {MESSAGES.global.singIn}
                            </button>
                        </Link>
                    ) : (
                        <button
                            className='btn btn-sm btn-ghost'
                            onClick={() => signOut({ callbackUrl: '/' })}>
                            {MESSAGES.global.singOut}
                        </button>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar
