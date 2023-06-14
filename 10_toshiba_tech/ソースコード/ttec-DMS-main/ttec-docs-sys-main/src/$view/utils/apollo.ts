import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const apolloClient = () => {
    const httpLink = new HttpLink({
        uri: '/api/graphql',
    })

    const authLink = setContext((_, { headers }) => {
        return { headers: headers }
    })

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: authLink.concat(httpLink),
        defaultOptions: {
            query: {
                fetchPolicy: 'network-only',
                canonizeResults: true,
            },
            mutate: {
                fetchPolicy: 'network-only',
            },
            watchQuery: {
                fetchPolicy: 'network-only',
                nextFetchPolicy: 'network-only',
                canonizeResults: true,
            },
        },
        cache: new InMemoryCache({
            resultCaching: false,
            canonizeResults: true,
        }),
        connectToDevTools: false,
    })
}
