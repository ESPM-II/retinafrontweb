import { gql } from "@apollo/client";

export const GET_ALL_CONTACTS = gql`
    query GetContacts {
    getContacts {
        contacts {
            _id
            contactPointType
            content
            createdAt
            status
        }
    }
}
`;