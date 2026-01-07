import { gql } from '@apollo/client';

// Auth Queries
export const ME_QUERY = gql`
  query Me {
    me {
      success
      user {
        id
        name
        email
        status
        roles {
          id
          name
          permissions {
            id
            name
            key
            parent_id
          }
        }
        additional_permissions {
          id
          name
          key
          parent_id
        }
      }
    }
  }
`;
