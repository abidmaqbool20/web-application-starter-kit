import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { MESSAGES, getErrorMessage } from "@/constants/messages";
import { GET_STATES, GET_STATE } from "@/graphql/queries/states";
import { CREATE_STATE, UPDATE_STATE, DELETE_STATE } from "@/graphql/mutations/states";
import { GET_COUNTRIES } from "@/graphql/queries/countries";

// Fetch all states
export const fetchStates = createAsyncThunk(
    "states/fetchStates",
    async (countryId = null, { rejectWithValue }) => {
        try {
            const variables = countryId ? { countryId: parseInt(countryId) } : {};
            const response = await graphqlService.query(GET_STATES, variables);
            return response.states;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single state by ID
export const fetchStateById = createAsyncThunk(
    "states/fetchStateById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_STATE, { id: parseInt(id) });
            return response.state;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create state
export const createState = createAsyncThunk(
    "states/createState",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(CREATE_STATE, {
                input: {
                    name: data.name,
                    countryId: parseInt(data.countryId),
                    isActive: data.isActive ?? true,
                },
            });
            return response.createState;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update state
export const updateState = createAsyncThunk(
    "states/updateState",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(UPDATE_STATE, {
                id: parseInt(data.id),
                input: {
                    name: data.name,
                    countryId: parseInt(data.countryId),
                    isActive: data.isActive,
                },
            });
            return response.updateState;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete state
export const deleteState = createAsyncThunk(
    "states/deleteState",
    async (id, { rejectWithValue }) => {
        try {
            await graphqlService.mutate(DELETE_STATE, { id: parseInt(id) });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch countries for dropdown
export const fetchCountriesForDropdown = createAsyncThunk(
    "states/fetchCountriesForDropdown",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_COUNTRIES);
            return response.countries;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // List data
    states: [],
    totalCount: 0,

    // Countries for dropdown
    countries: [],
    countriesLoading: false,

    // Single item
    selectedState: null,

    // Loading states
    loading: false,
    creating: false,
    updating: false,
    deleting: false,

    // Track if initial fetch was attempted (prevents infinite loops on error)
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
        sortField: "name",
        sortOrder: "asc",
    },

    // Filters
    filters: {
        search: "",
        countryId: "all", // 'all' | country id
    },

    // Form data
    formData: {
        name: "",
        countryId: "",
        isActive: true,
    },
};

const statesSlice = createSlice({
    name: "states",
    initialState,
    reducers: {
        // Modal controls
        openCreateModal: (state) => {
            state.isModalOpen = true;
            state.modalMode = "create";
            state.formData = { name: "", countryId: "", isActive: true };
            state.error = null;
        },
        openEditModal: (state, action) => {
            state.isModalOpen = true;
            state.modalMode = "edit";
            state.selectedState = action.payload;
            state.formData = {
                id: action.payload.id,
                name: action.payload.name || "",
                countryId: action.payload.country?.id || action.payload.countryId || "",
                isActive: action.payload.isActive ?? true,
            };
            state.error = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalMode = "create";
            state.selectedState = null;
            state.formData = { name: "", countryId: "", isActive: true };
            state.error = null;
        },

        // Form controls
        setFormData: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        resetFormData: (state) => {
            state.formData = { name: "", countryId: "", isActive: true };
        },

        // Pagination controls
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setSort: (state, action) => {
            const { field, order } = action.payload;
            state.pagination.sortField = field;
            state.pagination.sortOrder = order;
        },

        // Filter controls
        setSearchFilter: (state, action) => {
            state.filters.search = action.payload;
            state.pagination.page = 1;
        },
        setCountryFilter: (state, action) => {
            state.filters.countryId = action.payload;
            state.pagination.page = 1;
        },
        clearFilters: (state) => {
            state.filters = { search: "", countryId: "all" };
            state.pagination.page = 1;
        },

        // Clear errors
        clearError: (state) => {
            state.error = null;
        },

        // Reset fetch state to allow re-fetching (for refresh button)
        resetFetchState: (state) => {
            state.hasFetched = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch States
        builder
            .addCase(fetchStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.states = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchStates.rejected, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.error = action.payload;
            });

        // Fetch Countries for Dropdown
        builder
            .addCase(fetchCountriesForDropdown.pending, (state) => {
                state.countriesLoading = true;
            })
            .addCase(fetchCountriesForDropdown.fulfilled, (state, action) => {
                state.countriesLoading = false;
                state.countries = action.payload || [];
            })
            .addCase(fetchCountriesForDropdown.rejected, (state) => {
                state.countriesLoading = false;
            });

        // Fetch Single State
        builder
            .addCase(fetchStateById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStateById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedState = action.payload;
            })
            .addCase(fetchStateById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create State
        builder
            .addCase(createState.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createState.fulfilled, (state, action) => {
                state.creating = false;
                state.states.unshift(action.payload);
                state.totalCount += 1;
                state.isModalOpen = false;
                state.formData = { name: "", countryId: "", isActive: true };
                toast.success(MESSAGES.STATE.CREATED);
            })
            .addCase(createState.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.STATE.CREATE_ERROR));
            });

        // Update State
        builder
            .addCase(updateState.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateState.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.states.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) {
                    state.states[index] = action.payload;
                }
                state.isModalOpen = false;
                state.selectedState = null;
                state.formData = { name: "", countryId: "", isActive: true };
                toast.success(MESSAGES.STATE.UPDATED);
            })
            .addCase(updateState.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.STATE.UPDATE_ERROR));
            });

        // Delete State
        builder
            .addCase(deleteState.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteState.fulfilled, (state, action) => {
                state.deleting = false;
                state.states = state.states.filter((s) => s.id !== action.payload);
                state.totalCount -= 1;
                toast.success(MESSAGES.STATE.DELETED);
            })
            .addCase(deleteState.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.STATE.DELETE_ERROR));
            });
    },
});

export const {
    openCreateModal,
    openEditModal,
    closeModal,
    setFormData,
    resetFormData,
    setPagination,
    setPage,
    setSort,
    setSearchFilter,
    setCountryFilter,
    clearFilters,
    clearError,
    resetFetchState,
} = statesSlice.actions;

export default statesSlice.reducer;
