import { gql } from '@apollo/client';

// Cities Mutations
export const CREATE_CITY = gql`
  mutation CreateCity($input: CreateCityInput!) {
    createCity(input: $input) {
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

export const UPDATE_CITY = gql`
  mutation UpdateCity($id: Int!, $input: UpdateCityInput!) {
    updateCity(id: $id, input: $input) {
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

export const DELETE_CITY = gql`
  mutation DeleteCity($id: Int!) {
    deleteCity(id: $id)
  }
`;
