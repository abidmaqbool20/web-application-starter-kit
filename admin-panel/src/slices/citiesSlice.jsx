import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { MESSAGES, getErrorMessage } from "@/constants/messages";
import { GET_CITIES, GET_CITY } from "@/graphql/queries/cities";
import { CREATE_CITY, UPDATE_CITY, DELETE_CITY } from "@/graphql/mutations/cities";
import { GET_COUNTRIES } from "@/graphql/queries/countries";
import { GET_STATES } from "@/graphql/queries/states";

// Fetch all cities
export const fetchCities = createAsyncThunk(
    "cities/fetchCities",
    async (stateId = null, { rejectWithValue }) => {
        try {
            const variables = stateId ? { stateId: parseInt(stateId) } : {};
            const response = await graphqlService.query(GET_CITIES, variables);
            return response.cities;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single city by ID
export const fetchCityById = createAsyncThunk(
    "cities/fetchCityById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_CITY, { id: parseInt(id) });
            return response.city;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create city
export const createCity = createAsyncThunk(
    "cities/createCity",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(CREATE_CITY, {
                input: {
                    name: data.name,
                    stateId: parseInt(data.stateId),
                    countryId: parseInt(data.countryId),
                    isActive: data.isActive ?? true,
                },
            });
            return response.createCity;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update city
export const updateCity = createAsyncThunk(
    "cities/updateCity",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(UPDATE_CITY, {
                id: parseInt(data.id),
                input: {
                    name: data.name,
                    stateId: parseInt(data.stateId),
                    countryId: parseInt(data.countryId),
                    isActive: data.isActive,
                },
            });
            return response.updateCity;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete city
export const deleteCity = createAsyncThunk(
    "cities/deleteCity",
    async (id, { rejectWithValue }) => {
        try {
            await graphqlService.mutate(DELETE_CITY, { id: parseInt(id) });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch countries for dropdown
export const fetchCountriesForDropdown = createAsyncThunk(
    "cities/fetchCountriesForDropdown",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_COUNTRIES);
            return response.countries;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch states for dropdown
export const fetchStatesForDropdown = createAsyncThunk(
    "cities/fetchStatesForDropdown",
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

const initialState = {
    // List data
    cities: [],
    totalCount: 0,

    // Countries and States for dropdowns
    countries: [],
    states: [],
    countriesLoading: false,
    statesLoading: false,

    // Single item
    selectedCity: null,

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
        countryId: "all",
        stateId: "all",
    },

    // Form data
    formData: {
        name: "",
        countryId: "",
        stateId: "",
        isActive: true,
    },
};

const citiesSlice = createSlice({
    name: "cities",
    initialState,
    reducers: {
        // Modal controls
        openCreateModal: (state) => {
            state.isModalOpen = true;
            state.modalMode = "create";
            state.formData = { name: "", countryId: "", stateId: "", isActive: true };
            state.error = null;
        },
        openEditModal: (state, action) => {
            state.isModalOpen = true;
            state.modalMode = "edit";
            state.selectedCity = action.payload;
            state.formData = {
                id: action.payload.id,
                name: action.payload.name || "",
                countryId: action.payload.country?.id || action.payload.countryId || "",
                stateId: action.payload.state?.id || action.payload.stateId || "",
                isActive: action.payload.isActive ?? true,
            };
            state.error = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalMode = "create";
            state.selectedCity = null;
            state.formData = { name: "", countryId: "", stateId: "", isActive: true };
            state.error = null;
        },

        // Form controls
        setFormData: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        resetFormData: (state) => {
            state.formData = { name: "", countryId: "", stateId: "", isActive: true };
        },
        // Clear states when country changes
        clearStates: (state) => {
            state.states = [];
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
            state.filters.stateId = "all";
            state.pagination.page = 1;
        },
        setStateFilter: (state, action) => {
            state.filters.stateId = action.payload;
            state.pagination.page = 1;
        },
        clearFilters: (state) => {
            state.filters = { search: "", countryId: "all", stateId: "all" };
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
        // Fetch Cities
        builder
            .addCase(fetchCities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.cities = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchCities.rejected, (state, action) => {
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

        // Fetch States for Dropdown
        builder
            .addCase(fetchStatesForDropdown.pending, (state) => {
                state.statesLoading = true;
            })
            .addCase(fetchStatesForDropdown.fulfilled, (state, action) => {
                state.statesLoading = false;
                state.states = action.payload || [];
            })
            .addCase(fetchStatesForDropdown.rejected, (state) => {
                state.statesLoading = false;
            });

        // Fetch Single City
        builder
            .addCase(fetchCityById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCityById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCity = action.payload;
            })
            .addCase(fetchCityById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create City
        builder
            .addCase(createCity.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createCity.fulfilled, (state, action) => {
                state.creating = false;
                state.cities.unshift(action.payload);
                state.totalCount += 1;
                state.isModalOpen = false;
                state.formData = { name: "", countryId: "", stateId: "", isActive: true };
                toast.success(MESSAGES.CITY.CREATED);
            })
            .addCase(createCity.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.CITY.CREATE_ERROR));
            });

        // Update City
        builder
            .addCase(updateCity.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateCity.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.cities.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.cities[index] = action.payload;
                }
                state.isModalOpen = false;
                state.selectedCity = null;
                state.formData = { name: "", countryId: "", stateId: "", isActive: true };
                toast.success(MESSAGES.CITY.UPDATED);
            })
            .addCase(updateCity.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.CITY.UPDATE_ERROR));
            });

        // Delete City
        builder
            .addCase(deleteCity.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteCity.fulfilled, (state, action) => {
                state.deleting = false;
                state.cities = state.cities.filter((c) => c.id !== action.payload);
                state.totalCount -= 1;
                toast.success(MESSAGES.CITY.DELETED);
            })
            .addCase(deleteCity.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, MESSAGES.CITY.DELETE_ERROR));
            });
    },
});

export const {
    openCreateModal,
    openEditModal,
    closeModal,
    setFormData,
    resetFormData,
    clearStates,
    setPagination,
    setPage,
    setSort,
    setSearchFilter,
    setCountryFilter,
    setStateFilter,
    clearFilters,
    clearError,
    resetFetchState,
} = citiesSlice.actions;

export default citiesSlice.reducer;
