import type { AppProps } from 'next/app'
import Head from 'next/head'
import MESSAGES from '../messages/messages'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>{MESSAGES.global.appName}</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
