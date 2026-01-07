import { gql } from '@apollo/client';

// Countries Mutations
export const CREATE_COUNTRY = gql`
  mutation CreateCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      id
      name
      isoCode
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COUNTRY = gql`
  mutation UpdateCountry($id: Int!, $input: UpdateCountryInput!) {
    updateCountry(id: $id, input: $input) {
      id
      name
      isoCode
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COUNTRY = gql`
  mutation DeleteCountry($id: Int!) {
    deleteCountry(id: $id)
  }
`;
