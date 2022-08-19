import type { ReactElement } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MESSAGES from '../constants/messages'
import Layout from '../components/layout'

import '../styles/globals.css'

export type NextPageWithLayout<P = unknown> = NextPage<P> & {
    getLayout?: (page: ReactElement) => ReactElement
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout =
        Component.getLayout ?? ((page: ReactElement) => <Layout>{page}</Layout>)
    const { asPath } = useRouter()

    return (
        <>
            <Head>
                <title>{MESSAGES.global.appName}</title>
            </Head>
            {getLayout(
                <Component
                    {...pageProps}
                    key={asPath}
                />
            )}
        </>
    )
}
