import { gql } from "graphql-request";

export const GET_ALL_USERS = gql`
  query GET_USERS {
    getUsers {
      _id
      name
      lastName
    }
  }
`;
