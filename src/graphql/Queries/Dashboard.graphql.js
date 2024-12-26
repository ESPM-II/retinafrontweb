import { gql } from "@apollo/client";

export const GET_ACTIVE_USERS = gql`
  query GetActiveUsers {
    getActiveUsers {
      success
      message
      users {
        _id
        names
        lastNames
        contact
        rut
        socialName
        createdAt
        lastLogin
        verifyEmail
        uid
        commune
        email
        password
        birthDate
        gender
        isPatient
        tokenFirebase
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
        names
        lastNames
        contact
        rut
        socialName
        createdAt
        lastLogin
        verifyEmail
        uid
        commune
        email
        password
        birthDate
        gender
        isPatient
        tokenFirebase
      }
    }
  }
`;

export const GET_VERIFIED_USERS = gql`
  query GetVerifiedUsers {
    getVerifiedUsers {
      success
      message
      users {
        _id
        names
        lastNames
        contact
        rut
        socialName
        createdAt
        lastLogin
        verifyEmail
        uid
        commune
        email
        password
        birthDate
        gender
        isPatient
        tokenFirebase
      }
    }
  }
`;
