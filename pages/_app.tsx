import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/layout'
import MESSAGES from '../constants/messages'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    const { asPath } = useRouter()

    return (
        <>
            <Head>
                <title>{MESSAGES.global.appName}</title>
            </Head>
            <Layout>
                <Component
                    {...pageProps}
                    key={asPath}
                />
            </Layout>
        </>
    )
}

export default MyApp
