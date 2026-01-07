import { gql } from '@apollo/client';

// Master Data Queries
export const GET_MASTER_DATA_LIST = gql`
  query GetMasterDataList {
    masterDataList {
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

export const GET_MASTER_DATA = gql`
  query GetMasterData($id: ID!) {
    masterData(id: $id) {
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

export const GET_MASTER_DATA_BY_CATEGORY = gql`
  query GetMasterDataByCategory($category: String!, $activeOnly: Boolean) {
    masterDataByCategory(category: $category, activeOnly: $activeOnly) {
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

export const GET_MASTER_DATA_BY_PARENT = gql`
  query GetMasterDataByParent($parentId: ID!, $activeOnly: Boolean) {
    masterDataByParent(parentId: $parentId, activeOnly: $activeOnly) {
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

export const GET_MASTER_DATA_ROOT_ITEMS = gql`
  query GetMasterDataRootItems($category: String!, $activeOnly: Boolean) {
    masterDataRootItems(category: $category, activeOnly: $activeOnly) {
      id
      category
      key
      value
      label
      sortOrder
      metadata
      isActive
      createdAt
      updatedAt
    }
  }
`;
