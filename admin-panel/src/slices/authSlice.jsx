import { createSlice } from "@reduxjs/toolkit";
import graphqlService from "@/services/graphqlService";
import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractErrorMessage } from "@/helpers/shared";
import { LOGIN_MUTATION, LOGOUT_MUTATION } from "@/graphql/mutations/auth";
import { ME_QUERY } from "@/graphql/queries/auth";
import { buildMenu, resetMenu } from "./sidebarSlice";

// Login
export const loginRequest = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await graphqlService.mutate(LOGIN_MUTATION, {
        input: {
          username: data.email || data.username,
          password: data.password,
          user_type: data.user_type,
        },
      });
      if (response?.login?.success) {
        // Fetch user data using cookies
        const userResponse = await graphqlService.query(ME_QUERY);
        if (userResponse?.me?.success) {
          // Build menu with user permissions
          dispatch(buildMenu(userResponse.me.user));
          return userResponse.me.user;
        }
        return { loggedIn: true };
      }
      return rejectWithValue({ message: response?.login?.message || "Login failed" });
    } catch (error) {
      return rejectWithValue({ message: extractErrorMessage(error) || "Login failed" });
    }
  }
);

// Logout
export const logoutRequest = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await graphqlService.mutate(LOGOUT_MUTATION);
      // Clear Apollo cache on logout
      await graphqlService.clearCache();
      // Reset menu on logout
      dispatch(resetMenu());
      return { success: response?.logout?.success };
    } catch (error) {
      console.error("Logout error:", error);
      // Clear cache anyway on error
      await graphqlService.clearCache();
      // Reset menu on logout even on error
      dispatch(resetMenu());
      return { success: true };
    }
  }
);

// Get Current User
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await graphqlService.query(ME_QUERY);
      if (response?.me?.success) {
        // Build menu based on user permissions
        dispatch(buildMenu(response.me.user));
        return response.me.user;
      }
      return rejectWithValue({ message: "Failed to fetch user" });
    } catch (error) {
      return rejectWithValue({ message: extractErrorMessage(error) });
    }
  }
);

const initialState = {
  loginForm: {
    email: "",
    password: "",
  },
  requesting: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginForm: (state, action) => {
      state.loginForm[action.payload.field] = action.payload.value;
    },
    resetLoginForm: (state) => {
      state.loginForm.email = "";
      state.loginForm.password = "";
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginRequest.pending, (state) => {
        state.requesting = true;
        state.error = null;
      })
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.requesting = false;
        state.user = action.payload;
        state.error = null;
        toast.success("Login successful!");
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.requesting = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message || "Login failed");
      })
      // Logout
      .addCase(logoutRequest.pending, (state) => {
        state.requesting = true;
      })
      .addCase(logoutRequest.fulfilled, (state) => {
        state.requesting = false;
        state.user = null;
        state.error = null;
        toast.success("Logged out successfully");
      })
      .addCase(logoutRequest.rejected, (state) => {
        state.requesting = false;
        state.user = null;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.requesting = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.requesting = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.requesting = false;
        state.user = null;
        state.error = action.payload?.message;
      });
  },
});

export const { setLoginForm, resetLoginForm, setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
