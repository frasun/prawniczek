import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MESSAGES from '../messages/messages'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    const { asPath } = useRouter() /* Inside the component */

    return (
        <>
            <Head>
                <title>{MESSAGES.global.appName}</title>
            </Head>
            <div className='hero min-h-screen bg-base-200'>
                <main className='hero-content flex-col items-start w-full md:w-6/12'>
                    <Component
                        {...pageProps}
                        key={asPath}
                    />
                </main>
            </div>
        </>
    )
}

export default MyApp
