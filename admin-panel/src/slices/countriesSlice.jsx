import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { MESSAGES, getErrorMessage } from "@/constants/messages";
import { GET_COUNTRIES, GET_COUNTRY } from "@/graphql/queries/countries";
import { CREATE_COUNTRY, UPDATE_COUNTRY, DELETE_COUNTRY } from "@/graphql/mutations/countries";

// Fetch all countries
export const fetchCountries = createAsyncThunk(
    "countries/fetchCountries",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_COUNTRIES);
            return response.countries;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single country by ID
export const fetchCountryById = createAsyncThunk(
    "countries/fetchCountryById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_COUNTRY, { id: parseInt(id) });
            return response.country;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create country
export const createCountry = createAsyncThunk(
    "countries/createCountry",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(CREATE_COUNTRY, {
                input: {
                    name: data.name,
                    isoCode: data.isoCode,
                    isActive: data.isActive ?? true,
                },
            });
            return response.createCountry;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update country
export const updateCountry = createAsyncThunk(
    "countries/updateCountry",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(UPDATE_COUNTRY, {
                id: parseInt(data.id),
                input: {
                    name: data.name,
                    isoCode: data.isoCode,
                    isActive: data.isActive,
                },
            });
            return response.updateCountry;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete country
export const deleteCountry = createAsyncThunk(
    "countries/deleteCountry",
    async (id, { rejectWithValue }) => {
        try {
            await graphqlService.mutate(DELETE_COUNTRY, { id: parseInt(id) });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // List data
    countries: [],
    totalCount: 0,

    // Single item
    selectedCountry: null,

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
        status: "all", // 'all' | 'active' | 'inactive'
    },

    // Form data
    formData: {
        name: "",
        isoCode: "",
        isActive: true,
    },
};

const countriesSlice = createSlice({
    name: "countries",
    initialState,
    reducers: {
        // Modal controls
        openCreateModal: (state) => {
            state.isModalOpen = true;
            state.modalMode = "create";
            state.formData = { name: "", isoCode: "", isActive: true };
            state.error = null;
        },
        openEditModal: (state, action) => {
            state.isModalOpen = true;
            state.modalMode = "edit";
            state.selectedCountry = action.payload;
            state.formData = {
                id: action.payload.id,
                name: action.payload.name || "",
                isoCode: action.payload.isoCode || "",
                isActive: action.payload.isActive ?? true,
            };
            state.error = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalMode = "create";
            state.selectedCountry = null;
            state.formData = { name: "", isoCode: "", isActive: true };
            state.error = null;
        },

        // Form controls
        setFormData: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        resetFormData: (state) => {
            state.formData = { name: "", isoCode: "", isActive: true };
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
        setStatusFilter: (state, action) => {
            state.filters.status = action.payload;
            state.pagination.page = 1;
        },
        clearFilters: (state) => {
            state.filters = { search: "", status: "all" };
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
        // Fetch Countries
        builder
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.countries = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.error = action.payload;
            });

        // Fetch Single Country
        builder
            .addCase(fetchCountryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCountry = action.payload;
            })
            .addCase(fetchCountryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Country
        builder
            .addCase(createCountry.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action) => {
                state.creating = false;
                state.countries.unshift(action.payload);
                state.totalCount += 1;
                state.isModalOpen = false;
                state.formData = { name: "", isoCode: "", isActive: true };
                toast.success(MESSAGES.COUNTRY.CREATED);
            })
            .addCase(createCountry.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.COUNTRY.CREATE_ERROR));
            });

        // Update Country
        builder
            .addCase(updateCountry.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.countries.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.countries[index] = action.payload;
                }
                state.isModalOpen = false;
                state.selectedCountry = null;
                state.formData = { name: "", isoCode: "", isActive: true };
                toast.success(MESSAGES.COUNTRY.UPDATED);
            })
            .addCase(updateCountry.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.COUNTRY.UPDATE_ERROR));
            });

        // Delete Country
        builder
            .addCase(deleteCountry.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.deleting = false;
                state.countries = state.countries.filter((c) => c.id !== action.payload);
                state.totalCount -= 1;
                toast.success(MESSAGES.COUNTRY.DELETED);
            })
            .addCase(deleteCountry.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.COUNTRY.DELETE_ERROR));
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
    setStatusFilter,
    clearFilters,
    clearError,
    resetFetchState,
} = countriesSlice.actions;

export default countriesSlice.reducer;
