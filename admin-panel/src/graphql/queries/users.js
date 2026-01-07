import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
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
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
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
`;

export const GET_USER_WITH_STATUS_HISTORY = gql`
  query GetUserWithStatusHistory($id: ID!) {
    userWithStatusHistory(id: $id) {
      id
      name
      email
      status
      created_at
      updated_at
      roles {
        id
        name
        permissions {
          id
          name
          key
        }
      }
      additional_permissions {
        id
        name
        key
        parent_id
      }
      statuses {
        id
        status
        note
        changed_by
        created_at
      }
    }
  }
`;
