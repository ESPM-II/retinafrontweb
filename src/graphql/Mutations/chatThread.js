import { gql } from "graphql-request";

export const CREATE_CHAT_THREAD = gql`
  mutation CREATE_CHAT_THREAD ($content: String!, $threadId: String) {
    createThread (input: { content: $content, threadId: $threadId}) {
      botResponse
      threadId
    }
  }
`;
