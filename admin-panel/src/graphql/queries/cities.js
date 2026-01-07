import { gql } from '@apollo/client';

// Cities Queries
export const GET_CITIES = gql`
  query GetCities($stateId: Int) {
    cities(stateId: $stateId) {
      id
      name
      isActive
      createdAt
      updatedAt
      country {
        id
        name
      }
      state {
        id
        name
      }
    }
  }
`;

export const GET_CITY = gql`
  query GetCity($id: Int!) {
    city(id: $id) {
      id
      name
      isActive
      createdAt
      updatedAt
      country {
        id
        name
      }
      state {
        id
        name
      }
    }
  }
`;
