import { gql } from "@apollo/client";

export const GET_PERMISSIONS = gql`
    query Permissions {
        permissions {
            id
            name
            key
            parent_id
        }
    }
`;
