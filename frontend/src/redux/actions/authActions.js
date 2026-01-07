import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { jwtDecode } from "jwt-decode";

// Login with email and password
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const token = res.data.token;
      const user = jwtDecode(token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Register new user
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Google login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ googleId, email, name }, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        googleId,
        email,
        name,
      });

      const token = res.data.token;
      const user = jwtDecode(token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);
