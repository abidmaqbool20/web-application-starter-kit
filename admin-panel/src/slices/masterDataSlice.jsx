import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { MESSAGES, getErrorMessage } from "@/constants/messages";
import { GET_MASTER_DATA_LIST, GET_MASTER_DATA, GET_MASTER_DATA_BY_CATEGORY } from "@/graphql/queries/master-data";
import { CREATE_MASTER_DATA, UPDATE_MASTER_DATA, DELETE_MASTER_DATA } from "@/graphql/mutations/master-data";

// Fetch all master data
export const fetchMasterDataList = createAsyncThunk(
    "masterData/fetchMasterDataList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_MASTER_DATA_LIST);
            return response.masterDataList;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single master data by ID
export const fetchMasterDataById = createAsyncThunk(
    "masterData/fetchMasterDataById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_MASTER_DATA, { id: String(id) });
            return response.masterData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch master data by category (for dropdowns)
export const fetchMasterDataByCategory = createAsyncThunk(
    "masterData/fetchMasterDataByCategory",
    async ({ category, activeOnly = true }, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_MASTER_DATA_BY_CATEGORY, { category, activeOnly });
            return { category, data: response.masterDataByCategory };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create master data
export const createMasterData = createAsyncThunk(
    "masterData/createMasterData",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(CREATE_MASTER_DATA, {
                input: {
                    category: data.category,
                    key: data.key || null,
                    value: data.value,
                    label: data.label || null,
                    parentId: data.parentId ? String(data.parentId) : null,
                    sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0,
                    metadata: data.metadata || null,
                    isActive: data.isActive ?? true,
                },
            });
            return response.createMasterData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update master data
export const updateMasterData = createAsyncThunk(
    "masterData/updateMasterData",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(UPDATE_MASTER_DATA, {
                id: String(data.id),
                input: {
                    category: data.category,
                    key: data.key || null,
                    value: data.value,
                    label: data.label || null,
                    parentId: data.parentId ? String(data.parentId) : null,
                    sortOrder: data.sortOrder !== undefined ? parseInt(data.sortOrder, 10) : undefined,
                    metadata: data.metadata || null,
                    isActive: data.isActive,
                },
            });
            return response.updateMasterData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete master data
export const deleteMasterData = createAsyncThunk(
    "masterData/deleteMasterData",
    async (id, { rejectWithValue }) => {
        try {
            await graphqlService.mutate(DELETE_MASTER_DATA, { id: String(id) });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch parent items for dropdown (items that can be parents)
export const fetchParentItems = createAsyncThunk(
    "masterData/fetchParentItems",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_MASTER_DATA_LIST);
            return response.masterDataList;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // List data
    masterDataList: [],
    totalCount: 0,

    // Parent items for dropdown
    parentItems: [],
    parentItemsLoading: false,

    // Category data cache (for dropdowns in other modules)
    categoryData: {},

    // Single item
    selectedItem: null,

    // Loading states
    loading: false,
    creating: false,
    updating: false,
    deleting: false,

    // Track if initial fetch was attempted
    hasFetched: false,

    // Error states
    error: null,

    // Modal state
    isModalOpen: false,
    modalMode: "create", // 'create' | 'edit'

    // Pagination
    pagination: {
        page: 1,
        limit: 10,
        sortField: "category",
        sortOrder: "asc",
    },

    // Filters
    filters: {
        search: "",
        category: "all",
        isActive: "all",
    },

    // Form data
    formData: {
        category: "",
        key: "",
        value: "",
        label: "",
        parentId: "",
        sortOrder: 0,
        metadata: null,
        isActive: true,
    },
};

const masterDataSlice = createSlice({
    name: "masterData",
    initialState,
    reducers: {
        // Modal controls
        openCreateModal: (state) => {
            state.isModalOpen = true;
            state.modalMode = "create";
            state.formData = {
                category: "",
                key: "",
                value: "",
                label: "",
                parentId: "",
                sortOrder: 0,
                metadata: null,
                isActive: true,
            };
            state.error = null;
        },
        openEditModal: (state, action) => {
            state.isModalOpen = true;
            state.modalMode = "edit";
            state.selectedItem = action.payload;
            state.formData = {
                id: action.payload.id,
                category: action.payload.category || "",
                key: action.payload.key || "",
                value: action.payload.value || "",
                label: action.payload.label || "",
                parentId: action.payload.parentId || "",
                sortOrder: action.payload.sortOrder || 0,
                metadata: action.payload.metadata || null,
                isActive: action.payload.isActive ?? true,
            };
            state.error = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalMode = "create";
            state.selectedItem = null;
            state.formData = {
                category: "",
                key: "",
                value: "",
                label: "",
                parentId: "",
                sortOrder: 0,
                metadata: null,
                isActive: true,
            };
            state.error = null;
        },
        setFormData: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        clearError: (state) => {
            state.error = null;
        },

        // Pagination and sorting
        setSort: (state, action) => {
            state.pagination.sortField = action.payload.field;
            state.pagination.sortOrder = action.payload.order;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },

        // Filters
        setSearchFilter: (state, action) => {
            state.filters.search = action.payload;
            state.pagination.page = 1;
        },
        setCategoryFilter: (state, action) => {
            state.filters.category = action.payload;
            state.pagination.page = 1;
        },
        setActiveFilter: (state, action) => {
            state.filters.isActive = action.payload;
            state.pagination.page = 1;
        },
        clearFilters: (state) => {
            state.filters = { search: "", category: "all", isActive: "all" };
            state.pagination.page = 1;
        },

        // Reset state
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch all master data
            .addCase(fetchMasterDataList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMasterDataList.fulfilled, (state, action) => {
                state.loading = false;
                state.masterDataList = action.payload;
                state.totalCount = action.payload.length;
                state.hasFetched = true;
            })
            .addCase(fetchMasterDataList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.hasFetched = true;
                toast.error(getErrorMessage(action.payload));
            })

            // Fetch single item
            .addCase(fetchMasterDataById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMasterDataById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchMasterDataById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload));
            })

            // Fetch by category
            .addCase(fetchMasterDataByCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMasterDataByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categoryData[action.payload.category] = action.payload.data;
            })
            .addCase(fetchMasterDataByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch parent items
            .addCase(fetchParentItems.pending, (state) => {
                state.parentItemsLoading = true;
            })
            .addCase(fetchParentItems.fulfilled, (state, action) => {
                state.parentItemsLoading = false;
                state.parentItems = action.payload;
            })
            .addCase(fetchParentItems.rejected, (state, action) => {
                state.parentItemsLoading = false;
                state.error = action.payload;
            })

            // Create master data
            .addCase(createMasterData.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createMasterData.fulfilled, (state, action) => {
                state.creating = false;
                state.masterDataList.unshift(action.payload);
                state.totalCount += 1;
                state.isModalOpen = false;
                state.formData = {
                    category: "",
                    key: "",
                    value: "",
                    label: "",
                    parentId: "",
                    sortOrder: 0,
                    metadata: null,
                    isActive: true,
                };
                toast.success(MESSAGES.GENERIC.CREATE_SUCCESS);
            })
            .addCase(createMasterData.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.GENERIC.CREATE_ERROR));
            })

            // Update master data
            .addCase(updateMasterData.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateMasterData.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.masterDataList.findIndex(
                    (item) => String(item.id) === String(action.payload.id)
                );
                if (index !== -1) {
                    state.masterDataList[index] = action.payload;
                }
                state.isModalOpen = false;
                state.selectedItem = null;
                state.formData = {
                    category: "",
                    key: "",
                    value: "",
                    label: "",
                    parentId: "",
                    sortOrder: 0,
                    metadata: null,
                    isActive: true,
                };
                toast.success(MESSAGES.GENERIC.UPDATE_SUCCESS);
            })
            .addCase(updateMasterData.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.GENERIC.UPDATE_ERROR));
            })

            // Delete master data
            .addCase(deleteMasterData.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteMasterData.fulfilled, (state, action) => {
                state.deleting = false;
                state.masterDataList = state.masterDataList.filter(
                    (item) => String(item.id) !== String(action.payload)
                );
                state.totalCount -= 1;
                toast.success(MESSAGES.GENERIC.DELETE_SUCCESS);
            })
            .addCase(deleteMasterData.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.GENERIC.DELETE_ERROR));
            });
    },
});

export const {
    openCreateModal,
    openEditModal,
    closeModal,
    setFormData,
    clearError,
    setSort,
    setPage,
    setSearchFilter,
    setCategoryFilter,
    setActiveFilter,
    clearFilters,
    resetState,
} = masterDataSlice.actions;

export default masterDataSlice.reducer;
