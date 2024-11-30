import { gql } from '@apollo/client';

export const GET_SCHEDULE_LOGS = gql`
  query GetScheduleLogs {
    getScheduleLogs {
      _id
      professionalID
      number
      date
      userEmail
    }
  }
`;
