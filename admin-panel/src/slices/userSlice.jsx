import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_TOKEN, ACTIVE_USER } from "@/constants/index";

// Thunk to load user from local storage
export const loadUserFromLocalStorage = () => (dispatch) => {
  const user = localStorage.getItem(ACTIVE_USER);
  if (user) {
    dispatch(setActiveUser(JSON.parse(user)));
  }
};

// Utility to check token and handle redirect
export const checkAuthToken = (router) => {
  return localStorage.getItem(AUTH_TOKEN);

};

const initialState = {
  active: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action ) => {
      state.active = action.payload;
    },
    logoutUser: (state) => {
      state.active = null;
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem(ACTIVE_USER);
    },
  },
});

export const { logoutUser, setActiveUser } = userSlice.actions;
export default userSlice.reducer;
