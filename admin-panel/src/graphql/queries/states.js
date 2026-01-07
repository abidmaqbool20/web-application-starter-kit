import { gql } from '@apollo/client';

// States Queries
export const GET_STATES = gql`
  query GetStates($countryId: Int) {
    states(countryId: $countryId) {
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

export const GET_STATE = gql`
  query GetState($id: Int!) {
    state(id: $id) {
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
