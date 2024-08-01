import { gql } from "@apollo/client";

export const CHANGE_VISIBILITY = gql`
  mutation ChangeVisibility($id: ID!) {
    changeVisibility(id: $id) {
      success
      message
    }
  }
`;
