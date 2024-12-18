import { gql } from '@apollo/client';

export const GET_SCHEDULE_LOGS = gql`
  query GetScheduleLogs {
    getScheduleLogs {
      success
      message
      schedules {
        _id
        professionalID
        number
        date
        userEmail
      }
    }
  }
`;
