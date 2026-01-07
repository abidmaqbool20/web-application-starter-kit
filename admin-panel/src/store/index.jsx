import { configureStore } from "@reduxjs/toolkit";
import seoReducer from "@/slices/seoSlice";
import sidebarSlice from "@/slices/sidebarSlice";
import userSlice from "@/slices/userSlice";
import authSlice from "@/slices/authSlice";
import countriesSlice from "@/slices/countriesSlice";
import statesSlice from "@/slices/statesSlice";
import citiesSlice from "@/slices/citiesSlice";
import masterDataSlice from "@/slices/masterDataSlice";
import permissionsReducer from "@/slices/permissionsSlice";
import rolesReducer from "@/slices/rolesSlice";
import usersReducer from "@/slices/usersSlice";
import preferencesReducer from "@/slices/preferencesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pages: seoReducer,
    sidebar: sidebarSlice,
    user: userSlice,
    countries: countriesSlice,
    states: statesSlice,
    cities: citiesSlice,
    masterData: masterDataSlice,
    permissions: permissionsReducer,
    roles: rolesReducer,
    users: usersReducer,
    preferences: preferencesReducer,
  },
});
