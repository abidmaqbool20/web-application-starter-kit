import { gql } from '@apollo/client';

// Master Data Mutations
export const CREATE_MASTER_DATA = gql`
  mutation CreateMasterData($input: CreateMasterDataInput!) {
    createMasterData(input: $input) {
      id
      category
      key
      value
      label
      parentId
      sortOrder
      metadata
      isActive
      createdAt
      updatedAt
      parent {
        id
        value
        category
      }
    }
  }
`;

export const UPDATE_MASTER_DATA = gql`
  mutation UpdateMasterData($id: ID!, $input: UpdateMasterDataInput!) {
    updateMasterData(id: $id, input: $input) {
      id
      category
      key
      value
      label
      parentId
      sortOrder
      metadata
      isActive
      createdAt
      updatedAt
      parent {
        id
        value
        category
      }
    }
  }
`;

export const DELETE_MASTER_DATA = gql`
  mutation DeleteMasterData($id: ID!) {
    deleteMasterData(id: $id)
  }
`;

export const BULK_CREATE_MASTER_DATA = gql`
  mutation BulkCreateMasterData($inputs: [CreateMasterDataInput!]!) {
    bulkCreateMasterData(inputs: $inputs) {
      id
      category
      key
      value
      label
      parentId
      sortOrder
      metadata
      isActive
      createdAt
      updatedAt
    }
  }
`;
