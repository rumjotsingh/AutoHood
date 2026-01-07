import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// Get auth header helper
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const recordCarView = createAsyncThunk(
  "analytics/recordCarView",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.ANALYTICS.RECORD_VIEW(carId),
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      // Silently fail for view recording
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCarStats = createAsyncThunk(
  "analytics/fetchCarStats",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.ANALYTICS.CAR_STATS(carId),
        { headers: getAuthHeader() }
      );
      return { carId, stats: response.data.stats };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch car stats"
      );
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  "analytics/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, {
        headers: getAuthHeader(),
      });
      return response.data.dashboard;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchUserActivity = createAsyncThunk(
  "analytics/fetchUserActivity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS.ACTIVITY, {
        headers: getAuthHeader(),
      });
      return response.data.activity;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity"
      );
    }
  }
);

export const fetchPlatformAnalytics = createAsyncThunk(
  "analytics/fetchPlatformAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.ANALYTICS.PLATFORM, {
        headers: getAuthHeader(),
      });
      return response.data.analytics;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch platform analytics"
      );
    }
  }
);

const initialState = {
  // User dashboard data
  dashboard: {
    stats: {
      totalListings: 0,
      totalViews: 0,
      totalFavorites: 0,
      pendingInquiries: 0,
    },
    popularListings: [],
    recentActivity: [],
    viewsTrend: [],
  },

  // User activity
  activity: {
    recentViews: [],
    recentFavorites: [],
    recentInquiries: [],
  },

  // Individual car stats
  carStats: {},

  // Platform-wide analytics (admin)
  platformAnalytics: null,

  // Loading states
  dashboardLoading: false,
  activityLoading: false,
  platformLoading: false,

  // Errors
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Record car view (silent - no state updates needed)
      .addCase(recordCarView.fulfilled, () => {
        // View recorded successfully - no action needed
      })

      // Fetch car stats
      .addCase(fetchCarStats.fulfilled, (state, action) => {
        state.carStats[action.payload.carId] = action.payload.stats;
      })

      // Fetch dashboard
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      })

      // Fetch user activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.activityLoading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activity = action.payload;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.error = action.payload;
      })

      // Fetch platform analytics
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.platformLoading = true;
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.platformLoading = false;
        state.platformAnalytics = action.payload;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.platformLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
