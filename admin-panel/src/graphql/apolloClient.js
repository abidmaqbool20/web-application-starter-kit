import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GRAPHQL_URL } from '@/configs/AppConfig';

// Get the GraphQL URL from environment
const getGraphQLUrl = () => {
    // Use relative path for proxy in browser, direct URL for SSR
    if (typeof window !== 'undefined') {
        return '/api/graphql'; // Browser: use Next.js proxy
    }
    return GRAPHQL_URL || 'http://localhost:5001/graphql'; // SSR: direct connection
};

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
    uri: getGraphQLUrl(),
    credentials: 'include', // Important: Send cookies with requests
});

// Create Apollo Client
const apolloClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    countries: {
                        merge(existing, incoming) {
                            return incoming;
                        },
                    },
                    states: {
                        merge(existing, incoming) {
                            return incoming;
                        },
                    },
                    cities: {
                        merge(existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
        query: {
            fetchPolicy: 'network-only',
        },
    },
});

export default apolloClient;
