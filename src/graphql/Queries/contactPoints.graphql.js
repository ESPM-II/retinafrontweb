import { gql } from "@apollo/client";

export const GET_ALL_CONTACTS = gql`
  query GetContacts {
    getContacts {
      success
      message
      contacts {
        _id
        contactID
        userEmail
        adminEmail
        userData
        content
        createdAt
        status
        contactPointType
      }
    }
  }
`;

export const GET_DEFERRED_CONTACT_POINTS = gql`
  query GetContacts {
    getContacts {
      contacts {
        _id
        contactID
        userEmail
        adminEmail
        userData
        content
        createdAt
        status
        contactPointType
      }
    }
  }
`;

export const GET_CONTACT_BY_ID = gql`
  query GetContactByContactId($contactID: String!) {
    getContactByContactId(input: { contactID: $contactID }) {
      _id
      contactID
      userEmail
      adminEmail
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
