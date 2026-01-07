import { gql } from '@apollo/client';

// States Mutations
export const CREATE_STATE = gql`
  mutation CreateState($input: CreateStateInput!) {
    createState(input: $input) {
      id
      name
      isActive
      createdAt
      updatedAt
      country {
        id
        name
      }
    }
  }
`;

export const UPDATE_STATE = gql`
  mutation UpdateState($id: Int!, $input: UpdateStateInput!) {
    updateState(id: $id, input: $input) {
      id
      name
      isActive
      createdAt
      updatedAt
      country {
        id
        name
      }
    }
  }
`;

export const DELETE_STATE = gql`
  mutation DeleteState($id: Int!) {
    deleteState(id: $id)
  }
`;
