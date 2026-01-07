import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    permissions: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    filter: "",
    modalOpen: false,
    editingPermission: null,
};

const permissionsSlice = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        setPermissions(state, action) {
            state.permissions = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setPage(state, action) {
            state.page = action.payload;
        },
        setTotalPages(state, action) {
            state.totalPages = action.payload;
        },
        setFilter(state, action) {
            state.filter = action.payload;
        },
        setModalOpen(state, action) {
            state.modalOpen = action.payload;
        },
        setEditingPermission(state, action) {
            state.editingPermission = action.payload;
        },
    },
});

export const {
    setPermissions,
    setLoading,
    setError,
    setPage,
    setTotalPages,
    setFilter,
    setModalOpen,
    setEditingPermission,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
