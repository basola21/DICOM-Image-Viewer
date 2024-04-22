import axios from "axios";
import { createSlice, createAction } from "@reduxjs/toolkit";
import getAuthToken from "../utils/getAuthToken";

// Action creators
const startAuth = createAction("userAuth/startAuth");
const authSuccess = createAction("userAuth/authSuccess");
const authFailure = createAction("userAuth/authFailure");
const setUserDetails = createAction("userAuth/setUserDetails");
const userDetailsError = createAction("userAuth/userDetailsError");

export function fetchUserDetails() {
  return async (dispatch) => {
    const apiURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100";
    const token = getAuthToken();
    dispatch(startAuth());
    try {
      const response = await axios.get(`${apiURL}/users/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUserDetails(response.data));
    } catch (error) {
      dispatch(
        userDetailsError(
          error.response
            ? error.response.data.message
            : "Failed to fetch user details.",
        ),
      );
    }
  };
}

// authenticateUser function - Performs user authentication
export function authenticateUser({ email, password, mode }) {
  return async (dispatch) => {
    dispatch(startAuth());
    const apiURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100";
    try {
      const response = await axios.post(
        `${apiURL}/users/${mode}`, // 'login' or 'register'
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );
      const userData = response.data;
      localStorage.setItem("accessToken", userData.access_token);
      dispatch(authSuccess(userData));
      dispatch(fetchUserDetails()); // Fetch additional user details
    } catch (error) {
      console.error(error);
      dispatch(
        authFailure(
          error.response ? error.response.data.message : error.message,
        ),
      );
    }
  };
}
export function logOut() {
  return (dispatch) => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
  };
}
export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    user: {
      email: "",
      password: "",
    },
    isLoggedIn: !!localStorage.getItem("accessToken"),
    isLoading: false,
    error: null,
    mode: "login",
  },
  reducers: {
    resetUser: (state) => {
      localStorage.removeItem("accessToken");
      state.user = {
        email: "",
        password: "",
      };
      state.isLoggedIn = false;
      state.isLoading = false;
    },
    startAuth: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    setUserDetails: (state, action) => {
      state.user.email = action.payload.email;
    },
    userDetailsError: (state, action) => {
      state.error = action.payload;
    },
    changeMode: (state) => {
      state.mode = state.mode === "login" ? "register" : "login";
    },
  },
});

export const { resetUser, changeMode } = userAuthSlice.actions;
export default userAuthSlice.reducer;
