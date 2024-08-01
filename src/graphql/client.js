//import { GraphQLClient } from "graphql-request";

//const TOKEN = import.meta.env.VITE_TOKEN;

//const baseURL = {
//production: import.meta.env.VITE_PROD_API,
//qa: import.meta.env.VITE_QA_API,
//development: import.meta.env.VITE_DEV_API,
//};

//const ENV = import.meta.env.VITE_ENV;

//export const graphQLClient = new GraphQLClient(baseURL[ENV], {
//headers: {
//Authentication: `Bearer ${TOKEN}`,
//},
//});

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink // Import ApolloLink here
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const uri = import.meta.env.VITE_GRAPHQL_ENDPOINT;
const token = import.meta.env.VITE_API_TOKEN;

const httpLink = new HttpLink({ uri });

const authLink = setContext((_, { headers }) => {
  console.log("Token:", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});


export const client = new ApolloClient({
  //uri: uri, // Use the environment variable here
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;