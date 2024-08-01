import { gql } from "@apollo/client";

export const GET_ALL_CAMPAINGS = gql`
query GetCampaigns {
    getCampaigns {
        _id
        title
        type
        description
        createdAt
        image
    }
}
`;
