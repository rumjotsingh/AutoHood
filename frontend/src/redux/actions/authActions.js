import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosInstance";
import { jwtDecode } from "jwt-decode";

// Login with email and password
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/v1/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = jwtDecode(token);

      // Store token in localStorage
      localStorage.setItem("token", token);

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
      const res = await api.post("/v1/auth/register", userData);
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
      const res = await api.post("/v1/auth/google-login", {
        googleId,
        email,
        name,
      });

      const token = res.data.token;
      const user = jwtDecode(token);

      // Store token in localStorage
      localStorage.setItem("token", token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);
