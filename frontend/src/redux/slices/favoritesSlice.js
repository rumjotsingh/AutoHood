import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// Get auth header helper
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.FAVORITES.GET_ALL, {
        headers: getAuthHeader(),
      });
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch favorites"
      );
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.FAVORITES.ADD(carId),
        {},
        { headers: getAuthHeader() }
      );
      return response.data.favorite;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to favorites"
      );
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async (carId, { rejectWithValue }) => {
    try {
      await axios.delete(API_ENDPOINTS.FAVORITES.REMOVE(carId), {
        headers: getAuthHeader(),
      });
      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from favorites"
      );
    }
  }
);

export const checkFavorite = createAsyncThunk(
  "favorites/checkFavorite",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.FAVORITES.CHECK(carId), {
        headers: getAuthHeader(),
      });
      return { carId, isFavorite: response.data.isFavorite };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check favorite"
      );
    }
  }
);

const initialState = {
  favorites: [],
  favoriteIds: [], // Just the car IDs for quick lookup
  loading: false,
  error: null,
  checkingFavorite: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoriteIds = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        state.favoriteIds = action.payload.map((fav) => fav.car._id || fav.car);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to favorites
      .addCase(addToFavorites.pending, (state, action) => {
        state.checkingFavorite[action.meta.arg] = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.checkingFavorite[action.meta.arg] = false;
        state.favorites.push(action.payload);
        state.favoriteIds.push(action.payload.car._id || action.payload.car);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.checkingFavorite[action.meta.arg] = false;
        state.error = action.payload;
      })

      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state, action) => {
        state.checkingFavorite[action.meta.arg] = true;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.checkingFavorite[action.meta.arg] = false;
        state.favorites = state.favorites.filter(
          (fav) => (fav.car._id || fav.car) !== action.payload
        );
        state.favoriteIds = state.favoriteIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.checkingFavorite[action.meta.arg] = false;
        state.error = action.payload;
      })

      // Check favorite
      .addCase(checkFavorite.fulfilled, (state, action) => {
        if (
          action.payload.isFavorite &&
          !state.favoriteIds.includes(action.payload.carId)
        ) {
          state.favoriteIds.push(action.payload.carId);
        }
      });
  },
});

export const { clearFavorites, clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
