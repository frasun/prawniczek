import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MESSAGES from '../messages/messages'
import Navbar from '../components/navbar'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    const { asPath } = useRouter()

    return (
        <>
            <Head>
                <title>{MESSAGES.global.appName}</title>
            </Head>
            <SessionProvider session={pageProps.session}>
                <Navbar />
                <main className='hero flex-auto'>
                    <div className='hero-content flex-col items-start w-full md:w-6/12'>
                        <Component
                            {...pageProps}
                            key={asPath}
                        />
                    </div>
                </main>
            </SessionProvider>
        </>
    )
}

export default MyApp
