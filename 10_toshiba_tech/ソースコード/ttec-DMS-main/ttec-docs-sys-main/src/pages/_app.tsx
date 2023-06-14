import { RecoilRoot } from 'recoil'
import '../$view/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../$view/utils/apollo'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className='flex flex-col h-full bg-gray-50 text-gray-700'>
            <RecoilRoot>
                <ApolloProvider client={ apolloClient() }>
                    <Component { ...pageProps } />
                </ApolloProvider>
            </RecoilRoot>
        </div>
    )
}