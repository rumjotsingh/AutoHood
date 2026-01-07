import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosInstance";

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/favorites/my-favorites");
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
      const response = await api.post(`/v1/favorites/${carId}`);
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
      await api.delete(`/v1/favorites/${carId}`);
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
      const response = await api.get(`/v1/favorites/check/${carId}`);
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
        state.favorites = action.payload || [];
        state.favoriteIds = (action.payload || [])
          .map((fav) => {
            if (!fav) return null;
            if (fav.car && fav.car._id) return fav.car._id;
            if (fav.car) return fav.car;
            if (fav._id) return fav._id;
            return null;
          })
          .filter(Boolean);
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
        if (action.payload) {
          state.favorites.push(action.payload);
          const carId =
            action.payload.car?._id || action.payload.car || action.payload._id;
          if (carId) state.favoriteIds.push(carId);
        }
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
        state.favorites = state.favorites.filter((fav) => {
          const carId = fav?.car?._id || fav?.car || fav?._id;
          return carId !== action.payload;
        });
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
