/**
 * Centralized Toast Messages
 * 
 * Usage:
 * import { MESSAGES } from "@/constants/messages";
 * toast.success(MESSAGES.COUNTRY.CREATED);
 */

export const MESSAGES = {
    // Generic CRUD messages
    GENERIC: {
        CREATE_SUCCESS: "Record created successfully",
        UPDATE_SUCCESS: "Record updated successfully",
        DELETE_SUCCESS: "Record deleted successfully",
        FETCH_ERROR: "Failed to fetch data",
        CREATE_ERROR: "Failed to create record",
        UPDATE_ERROR: "Failed to update record",
        DELETE_ERROR: "Failed to delete record",
    },

    // Country messages
    COUNTRY: {
        CREATED: "Country created successfully",
        UPDATED: "Country updated successfully",
        DELETED: "Country deleted successfully",
        FETCH_ERROR: "Failed to fetch countries",
        CREATE_ERROR: "Failed to create country",
        UPDATE_ERROR: "Failed to update country",
        DELETE_ERROR: "Failed to delete country",
    },

    // State messages
    STATE: {
        CREATED: "State created successfully",
        UPDATED: "State updated successfully",
        DELETED: "State deleted successfully",
        FETCH_ERROR: "Failed to fetch states",
        CREATE_ERROR: "Failed to create state",
        UPDATE_ERROR: "Failed to update state",
        DELETE_ERROR: "Failed to delete state",
    },

    // City messages
    CITY: {
        CREATED: "City created successfully",
        UPDATED: "City updated successfully",
        DELETED: "City deleted successfully",
        FETCH_ERROR: "Failed to fetch cities",
        CREATE_ERROR: "Failed to create city",
        UPDATE_ERROR: "Failed to update city",
        DELETE_ERROR: "Failed to delete city",
    },

    // Auth messages
    AUTH: {
        LOGIN_SUCCESS: "Login successful",
        LOGOUT_SUCCESS: "Logged out successfully",
        LOGIN_ERROR: "Invalid credentials",
        SESSION_EXPIRED: "Session expired. Please login again",
        UNAUTHORIZED: "You are not authorized to perform this action",
    },

    // Permission messages
    PERMISSION: {
        DENIED: "You don't have permission to perform this action",
    },

    // Validation messages
    VALIDATION: {
        REQUIRED_FIELD: "This field is required",
        INVALID_EMAIL: "Please enter a valid email",
        MIN_LENGTH: (field, length) => `${field} must be at least ${length} characters`,
        MAX_LENGTH: (field, length) => `${field} must not exceed ${length} characters`,
    },
};

/**
 * Helper function to show toast with extracted error message
 */
export const getErrorMessage = (error, fallback = "An error occurred") => {
    if (typeof error === "string") return error;
    if (error?.message) {
        if (Array.isArray(error.message)) return error.message.join(", ");
        return error.message;
    }
    if (error?.data?.message) return error.data.message;
    return fallback;
};
