  import { gql } from "@apollo/client";

  export const CREATE_CAMPAIGN = gql`
    mutation CreateCampaign($type: String!, $title: String!, $description: String!, $image: Upload!) {
      createCampaign(input: { 
        type: $type, 
        title: $title, 
        description: $description,
        image: $image
      }) {
        success
        message
      }
    }
  `;
