import apolloClient from '@/graphql/apolloClient';

/**
 * GraphQL Service for making queries and mutations
 */
const graphqlService = {
    /**
     * Execute a GraphQL query
     * @param {Object} query - The GraphQL query document
     * @param {Object} variables - Variables for the query
     * @returns {Promise} - Query result
     */
    query: async (query, variables = {}) => {
        try {
            const queryOptions = {
                query,
                variables,
                fetchPolicy: 'network-only',
            };

            const result = await apolloClient.query(queryOptions);
            return result.data;
        } catch (error) {
            console.error('GraphQL Query Error:', error);
            throw error;
        }
    },

    /**
     * Execute a GraphQL mutation
     * @param {Object} mutation - The GraphQL mutation document
     * @param {Object} variables - Variables for the mutation
     * @returns {Promise} - Mutation result
     */
    mutate: async (mutation, variables = {}) => {
        try {
            const result = await apolloClient.mutate({
                mutation,
                variables,
            });
            return result.data;
        } catch (error) {
            console.error('GraphQL Mutation Error:', error);
            throw error;
        }
    },

    /**
     * Reset the Apollo cache
     */
    resetCache: () => {
        return apolloClient.resetStore();
    },

    /**
     * Clear the Apollo cache without refetching
     */
    clearCache: () => {
        return apolloClient.clearStore();
    },
};

export default graphqlService;
