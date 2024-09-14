import { gql } from "@apollo/client";

export const GET_ALL_CONTACTS = gql`
  query GetAllContacts {
    getContacts {
      contacts {
        _id
        contactID
        contactPointType
        content
        userData
        createdAt
        status
      }
    }
  }
`;

export const GET_DEFERRED_CONTACT_POINTS = gql`
  query GetDeferredContactPoints {
    getDeferredContactPoints {
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

