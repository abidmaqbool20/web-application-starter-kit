import { gql } from '@apollo/client';

// Countries Queries
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      id
      name
      isoCode
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_COUNTRY = gql`
  query GetCountry($id: Int!) {
    country(id: $id) {
      id
      name
      isoCode
      isActive
      createdAt
      updatedAt
    }
  }
`;
