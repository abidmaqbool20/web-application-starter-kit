import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { MESSAGES, getErrorMessage } from "@/constants/messages";
import { GET_ROLES, GET_ROLE } from "@/graphql/queries/roles";
import { CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE } from "@/graphql/mutations/roles";
import { GET_PERMISSIONS } from "@/graphql/queries/permissions";

// Fetch all roles
export const fetchRoles = createAsyncThunk(
    "roles/fetchRoles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_ROLES);
            return response.roles;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single role by ID
export const fetchRoleById = createAsyncThunk(
    "roles/fetchRoleById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_ROLE, { id });
            return response.role;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch permissions for dropdown
export const fetchPermissionsForDropdown = createAsyncThunk(
    "roles/fetchPermissionsForDropdown",
    async (_, { rejectWithValue }) => {
        try {
            const response = await graphqlService.query(GET_PERMISSIONS);
            return response.permissions;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create role
export const createRole = createAsyncThunk(
    "roles/createRole",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(CREATE_ROLE, {
                input: {
                    name: data.name,
                    permissionIds: data.permissions || [],
                },
            });
            return response.createRole;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update role
export const updateRole = createAsyncThunk(
    "roles/updateRole",
    async (data, { rejectWithValue }) => {
        try {
            const response = await graphqlService.mutate(UPDATE_ROLE, {
                id: data.id,
                input: {
                    name: data.name,
                    permissionIds: data.permissions || [],
                },
            });
            return response.updateRole;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete role
export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (id, { rejectWithValue }) => {
        try {
            await graphqlService.mutate(DELETE_ROLE, { id });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // List data
    roles: [],
    totalCount: 0,

    // Permissions for dropdowns
    permissions: [],
    permissionsLoading: false,

    // Single item
    selectedRole: null,

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
        permissions: [],
    },
};

const rolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        // Modal controls
        openCreateModal: (state) => {
            state.isModalOpen = true;
            state.modalMode = "create";
            state.formData = { name: "", permissions: [] };
            state.error = null;
        },
        openEditModal: (state, action) => {
            state.isModalOpen = true;
            state.modalMode = "edit";
            state.selectedRole = action.payload;
            state.formData = {
                id: action.payload.id,
                name: action.payload.name || "",
                permissions: action.payload.permissions?.map(p => p.id) || [],
            };
            state.error = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalMode = "create";
            state.selectedRole = null;
            state.formData = { name: "", permissions: [] };
            state.error = null;
        },

        // Form controls
        setFormData: (state, action) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        resetFormData: (state) => {
            state.formData = { name: "", permissions: [] };
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

        // Legacy actions for backward compatibility
        setModalOpen(state, action) {
            state.isModalOpen = action.payload;
        },
        setModalMode(state, action) {
            state.modalMode = action.payload;
        },
        setSelectedRole(state, action) {
            state.selectedRole = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Roles
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.roles = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.hasFetched = true;
                state.error = action.payload;
            });

        // Fetch Permissions for Dropdown
        builder
            .addCase(fetchPermissionsForDropdown.pending, (state) => {
                state.permissionsLoading = true;
            })
            .addCase(fetchPermissionsForDropdown.fulfilled, (state, action) => {
                state.permissionsLoading = false;
                state.permissions = action.payload || [];
            })
            .addCase(fetchPermissionsForDropdown.rejected, (state) => {
                state.permissionsLoading = false;
            });

        // Fetch Single Role
        builder
            .addCase(fetchRoleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRole = action.payload;
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Role
        builder
            .addCase(createRole.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.creating = false;
                state.roles.unshift(action.payload);
                state.totalCount += 1;
                state.isModalOpen = false;
                state.formData = { name: "", permissions: [] };
                toast.success("Role created successfully");
            })
            .addCase(createRole.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, "Failed to create role"));
            });

        // Update Role
        builder
            .addCase(updateRole.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.roles.findIndex((r) => r.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
                state.isModalOpen = false;
                state.selectedRole = null;
                state.formData = { name: "", permissions: [] };
                toast.success("Role updated successfully");
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, "Failed to update role"));
            });

        // Delete Role
        builder
            .addCase(deleteRole.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.deleting = false;
                state.roles = state.roles.filter((r) => r.id !== action.payload);
                state.totalCount -= 1;
                toast.success("Role deleted successfully");
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
                toast.error(getErrorMessage(action.payload, "Failed to delete role"));
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
    clearFilters,
    clearError,
    resetFetchState,
    setModalOpen,
    setModalMode,
    setSelectedRole,
} = rolesSlice.actions;

export default rolesSlice.reducer;
