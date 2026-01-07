import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { GET_USERS, GET_USER, GET_USER_WITH_STATUS_HISTORY } from "@/graphql/queries/users";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "@/graphql/mutations/users";

// Fetch all users
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_USERS);
            return response.users;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single user by ID
export const fetchUserById = createAsyncThunk(
    "users/fetchUserById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_USER, { id });
            return response.user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch user with status history
export const fetchUserWithStatusHistory = createAsyncThunk(
    "users/fetchUserWithStatusHistory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_USER_WITH_STATUS_HISTORY, { id });
            return response.userWithStatusHistory;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create user
export const createUser = createAsyncThunk(
    "users/createUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(CREATE_USER, {
                input: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    status: data.status || "active",
                    roleIds: data.roleIds || [],
                    additionalPermissionIds: data.additionalPermissionIds || [],
                },
            });
            toast.success("User created successfully");
            return response.createUser;
        } catch (error) {
            toast.error(error.message || "Failed to create user");
            return rejectWithValue(error.message);
        }
    }
);

// Update user
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await graphqlService.resetCache();

            const input = {
                name: data.name,
                email: data.email,
                status: data.status || "active",
                roleIds: data.roleIds || [],
                additionalPermissionIds: data.additionalPermissionIds || [],
            };

            if (data.password && data.password.trim() !== "") {
                input.password = data.password;
            }

            const response = await graphqlService.mutate(UPDATE_USER, {
                id,
                input,
            });
            toast.success("User updated successfully");
            return response.updateUser;
        } catch (error) {
            toast.error(error.message || "Failed to update user");
            return rejectWithValue(error.message);
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await graphqlService.mutate(DELETE_USER, { id });
            toast.success("User deleted successfully");
            return id;
        } catch (error) {
            toast.error(error.message || "Failed to delete user");
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // List data
    users: [],
    totalCount: 0,

    // Single item
    selectedUser: null,
    viewUser: null,

    // Loading states
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    loadingView: false,

    // Track if initial fetch was attempted
    hasFetched: false,

    // Error states
    error: null,

    // Modal state
    isModalOpen: false,
    isEditMode: false,
    isViewDrawerOpen: false,

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
    },

    // Form data
    formData: {
        name: "",
        email: "",
        password: "",
        status: "active",
        roleIds: [],
        additionalPermissionIds: [],
    },
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        // Modal controls
        openModal: (state) => {
            state.isModalOpen = true;
            state.isEditMode = false;
            state.formData = {
                name: "",
                email: "",
                password: "",
                status: "active",
                roleIds: [],
                additionalPermissionIds: [],
            };
            state.error = null;
        },
        setEditMode: (state, action) => {
            state.isEditMode = true;
            state.isModalOpen = true;
            state.selectedUser = action.payload;
            state.formData = {
                id: action.payload.id,
                name: action.payload.name || "",
                email: action.payload.email || "",
                password: "",
                status: action.payload.status || "active",
                roleIds: action.payload.roles?.map(r => r.id) || [],
                additionalPermissionIds: action.payload.additional_permissions?.map(p => p.id) || [],
            };
            state.error = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.isEditMode = false;
            state.selectedUser = null;
            state.formData = {
                name: "",
                email: "",
                password: "",
                status: "active",
                roleIds: [],
                additionalPermissionIds: [],
            };
            state.error = null;
        },

        // View drawer controls
        openViewDrawer: (state) => {
            state.isViewDrawerOpen = true;
        },
        closeViewDrawer: (state) => {
            state.isViewDrawerOpen = false;
            state.viewUser = null;
        },

        // Form controls
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        resetFormData: (state) => {
            state.formData = {
                name: "",
                email: "",
                password: "",
                status: "active",
                roleIds: [],
                additionalPermissionIds: [],
            };
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
        clearFilters: (state) => {
            state.filters = { search: "" };
            state.pagination.page = 1;
        },

        // Clear errors
        clearError: (state) => {
            state.error = null;
        },

        // Reset fetch state to allow re-fetching
        resetFetchState: (state) => {
            state.hasFetched = false;
            state.error = null;
        },

        // Compatibility actions
        setCurrentPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setPageSize: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
        },
        setSortBy: (state, action) => {
            state.pagination.sortField = action.payload;
        },
        setSortOrder: (state, action) => {
            state.pagination.sortOrder = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.filters.search = action.payload;
            state.pagination.page = 1;
        },
    },
    extraReducers: (builder) => {
        // Fetch Users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.users = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.error = action.payload;
            });

        // Fetch User By ID
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch User With Status History
        builder
            .addCase(fetchUserWithStatusHistory.pending, (state) => {
                state.loadingView = true;
                state.error = null;
            })
            .addCase(fetchUserWithStatusHistory.fulfilled, (state, action) => {
                state.loadingView = false;
                state.viewUser = action.payload;
                state.isViewDrawerOpen = true;
            })
            .addCase(fetchUserWithStatusHistory.rejected, (state, action) => {
                state.loadingView = false;
                state.error = action.payload;
            });

        // Create User
        builder
            .addCase(createUser.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.creating = false;
                state.users.push(action.payload);
                state.totalCount += 1;
                state.isModalOpen = false;
                state.formData = {
                    name: "",
                    email: "",
                    password: "",
                    status: "active",
                    roleIds: [],
                    additionalPermissionIds: [],
                };
                // Refetch users after create
                state.hasFetched = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });

        // Update User
        builder
            .addCase(updateUser.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.users.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.isModalOpen = false;
                state.isEditMode = false;
                state.selectedUser = null;
                state.formData = {
                    name: "",
                    email: "",
                    password: "",
                    status: "active",
                    roleIds: [],
                    additionalPermissionIds: [],
                };
                // Refetch users after update
                state.hasFetched = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });

        // Delete User
        builder
            .addCase(deleteUser.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.deleting = false;
                state.users = state.users.filter((user) => user.id !== action.payload);
                state.totalCount -= 1;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    },
});

export const {
    openModal,
    setEditMode,
    closeModal,
    openViewDrawer,
    closeViewDrawer,
    setFormData,
    resetFormData,
    setPagination,
    setPage,
    setSort,
    setSearchFilter,
    clearFilters,
    clearError,
    resetFetchState,
    setCurrentPage,
    setPageSize,
    setSortBy,
    setSortOrder,
    setSearchTerm,
} = usersSlice.actions;

export default usersSlice.reducer;
