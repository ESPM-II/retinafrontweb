// src/graphql/client.js
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const uri = import.meta.env.VITE_GRAPHQL_ENDPOINT;
const token = import.meta.env.VITE_API_TOKEN;

const httpLink = new HttpLink({ uri });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
