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
      authorization: token ? `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHItZWRpZmljaW8tZGVmb3JtZXMiLCJhdWQiOiJkci1lZGlmaWNpby1kZWZvcm1lcyIsImF1dGhfdGltZSI6MTcyNTU1MTY0MiwidXNlcl9pZCI6ImNNU3JWVTFibURYYmh1Z09DOEMwV3lVWGxVRTIiLCJzdWIiOiJjTVNyVlUxYm1EWGJodWdPQzhDMFd5VVhsVUUyIiwiaWF0IjoxNzI1NTUxNjQyLCJleHAiOjE3MjU1NTUyNDIsImVtYWlsIjoiamphb2xpdm9zLjAyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImpqYW9saXZvcy4wMkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.jEoLidzI2wOOZ_vihOUqKPER8-ZNoa4ERS2ErUY1vOXVtgWxRjhO3CrXMJhVJbPCfLqY9jLnru2W3SQzCBjg6H5OVPk2fk3-IgyQBRhQxqVIm6x0L6disWigiD_MkZFXWvOed5UksJIdluuOSLeCdVcyYathgNqLK5gF6H3zKVi_64_VNwVYE-odtbdZ99ZnaxP_hl3b11_JeQaZ70L5mg0OpzNq46OV0TE72eOgZ4E7eN-P5TcyzS31UsFUN-61ynUVNYD-evOH5Su8A-tVOnKT0pgNpgavfbPYJbSgj3hB6VrVKp5kskL7-l3Kq5UwXvZuXDnQ76sXV18tpHt3eQ` : "",
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
