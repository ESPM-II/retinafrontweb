import { gql } from '@apollo/client';

export const USER_LOGIN = gql`
  mutation UserLogin($login: String!, $password: String!) {
    userLogin(login: $login, password: $password) {
      success
      message
      user {
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
