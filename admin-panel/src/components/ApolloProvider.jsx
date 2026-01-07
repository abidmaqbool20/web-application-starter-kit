"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import apolloClient from "@/graphql/apolloClient";

export default function ApolloProvider({ children }) {
    return (
        <BaseApolloProvider client={apolloClient}>
            {children}
        </BaseApolloProvider>
    );
}
