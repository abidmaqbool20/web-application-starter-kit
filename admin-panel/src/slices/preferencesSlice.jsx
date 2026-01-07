import { createSlice } from "@reduxjs/toolkit";
import { getPreferences, setPreferences } from "@/lib/cookies";

// Load initial preferences from cookies
const loadInitialPreferences = () => {
    const savedPrefs = getPreferences();

    return {
        theme: savedPrefs?.theme || "light", // 'light' or 'dark'
        sidebarLocked: savedPrefs?.sidebarLocked ?? true, // sidebar pinned/locked state
        sidebarCollapsed: savedPrefs?.sidebarCollapsed ?? false, // sidebar collapsed state
    };
};

const initialState = loadInitialPreferences();

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            // Save to cookie
            setPreferences({
                theme: state.theme,
                sidebarLocked: state.sidebarLocked,
                sidebarCollapsed: state.sidebarCollapsed,
            });
        },
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
            // Save to cookie
            setPreferences({
                theme: state.theme,
                sidebarLocked: state.sidebarLocked,
                sidebarCollapsed: state.sidebarCollapsed,
            });
        },
        setSidebarLocked: (state, action) => {
            state.sidebarLocked = action.payload;
            // Save to cookie
            setPreferences({
                theme: state.theme,
                sidebarLocked: state.sidebarLocked,
                sidebarCollapsed: state.sidebarCollapsed,
            });
        },
        toggleSidebarLocked: (state) => {
            state.sidebarLocked = !state.sidebarLocked;
            // Save to cookie
            setPreferences({
                theme: state.theme,
                sidebarLocked: state.sidebarLocked,
                sidebarCollapsed: state.sidebarCollapsed,
            });
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload;
            // Save to cookie
            setPreferences({
                theme: state.theme,
                sidebarLocked: state.sidebarLocked,
                sidebarCollapsed: state.sidebarCollapsed,
            });
        },
        toggleSidebarCollapsed: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            // Save to cookie
            setPreferences({
                theme: state.theme,
                sidebarLocked: state.sidebarLocked,
                sidebarCollapsed: state.sidebarCollapsed,
            });
        },
    },
});

export const {
    setTheme,
    toggleTheme,
    setSidebarLocked,
    toggleSidebarLocked,
    setSidebarCollapsed,
    toggleSidebarCollapsed,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
