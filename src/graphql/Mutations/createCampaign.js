import { gql } from "@apollo/client";

export const CREATE_CAMPAIGN = gql`
mutation CreateCampaign {
  createCampaign(input: { 
    type: "ejemplo", 
    title: "ejemplo", 
    description: "ejemplo" 
  }) {
    success
    message
  }
}
`;