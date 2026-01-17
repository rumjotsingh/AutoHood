import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosInstance";

// Async thunks for API calls
export const fetchAllCars = createAsyncThunk(
  "cars/fetchAll",
  async ({ page = 1, limit = 3 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/v1/cars/all-cars?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cars");
    }
  },
);

export const fetchCarDetails = createAsyncThunk(
  "cars/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/cars/all-cars/${id}`);
      return response.data;
    } catch {
      return rejectWithValue("Failed to fetch car details");
    }
  },
);

export const searchCars = createAsyncThunk(
  "cars/search",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/v1/cars/search?query=${encodeURIComponent(searchTerm)}`,
      );
      return response.data;
    } catch {
      return rejectWithValue("Failed to search cars");
    }
  },
);

export const deleteCar = createAsyncThunk(
  "cars/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`/v1/cars/car-listing/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete car");
    }
  },
);

export const createCar = createAsyncThunk(
  "cars/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/cars/new-car", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // { message, newCar }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create car");
    }
  },
);

const initialState = {
  cars: [],
  currentCar: null,
  searchResults: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 3,
  },
  loading: false,
  error: null,
};

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCurrentCar: (state) => {
      state.currentCar = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all cars
    builder
      .addCase(fetchAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.cars;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch car details
    builder
      .addCase(fetchCarDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCar = action.payload;
      })
      .addCase(fetchCarDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search cars
    builder
      .addCase(searchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete car
    builder
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter((car) => car._id !== action.payload);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create car
    builder
      .addCase(createCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload expected: { message, newCar }
        const newCar =
          action.payload?.newCar || action.payload?.data || action.payload;
        if (newCar) {
          state.cars = [newCar, ...state.cars];
        }
      })
      .addCase(createCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  clearSearchResults,
  clearCurrentCar,
  clearError,
} = carsSlice.actions;
export default carsSlice.reducer;
