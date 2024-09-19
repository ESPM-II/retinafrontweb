import { gql } from '@apollo/client';

export const GET_ACTIVE_USERS = gql`
  query GetActiveUsers {
    getActiveUsers {
      success
      message
      users {
        _id
        createdAt
      }
    }
  }
`;

export const GET_REGISTER_USERS = gql`
  query GetRegisterUsers {
    getRegisterUsers {
      success
      message
      users {
        _id
        createdAt
      }
    }
  }
`;
