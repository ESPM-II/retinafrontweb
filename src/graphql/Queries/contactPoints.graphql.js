import { gql } from "@apollo/client";

export const GET_ALL_CONTACTS = gql`
  query GetAllContacts {
    getContacts {
      contacts {
        _id
        contactID
        contactPointType
        content
        createdAt
        status
      }
    }
  }
`;

export const GET_CONTACT_BY_ID = gql`
  query GetContactByContactId($input: GetContactInput!) {
    getContactByContactId(input: $input) {
      _id
      contactID
      userEmail
      userData
      content
      createdAt
      status
      contactPointType
    }
  }
`;

export const SAVE_ADMIN_REPLY = gql`
  mutation SaveAdminReply($input: AdminReplyInput!) {
    saveAdminReply(input: $input) {
      _id
      contactID
      content
      createdAt
      status
    }
  }
`;

