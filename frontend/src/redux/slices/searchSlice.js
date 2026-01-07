import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// Async thunks
export const advancedSearch = createAsyncThunk(
  "search/advancedSearch",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH.ADVANCED, {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

export const fetchFilterOptions = createAsyncThunk(
  "search/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH.FILTER_OPTIONS);
      return response.data.filters;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch filter options"
      );
    }
  }
);

export const compareCars = createAsyncThunk(
  "search/compareCars",
  async (carIds, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH.COMPARE, {
        params: { ids: carIds.join(",") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to compare cars"
      );
    }
  }
);

export const fetchSimilarCars = createAsyncThunk(
  "search/fetchSimilarCars",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH.SIMILAR(carId));
      return response.data.similarCars;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch similar cars"
      );
    }
  }
);

export const fetchTrendingCars = createAsyncThunk(
  "search/fetchTrendingCars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH.TRENDING);
      return response.data.trendingCars;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trending cars"
      );
    }
  }
);

const initialState = {
  // Search results
  results: [],
  totalResults: 0,
  currentPage: 1,
  totalPages: 1,

  // Filter options
  filterOptions: {
    companies: [],
    colors: [],
    engineTypes: [],
    priceRange: { min: 0, max: 1000000 },
    mileageRange: { min: 0, max: 500000 },
    years: [],
  },

  // Active filters
  activeFilters: {
    query: "",
    company: "",
    colors: [],
    engineTypes: [],
    minPrice: "",
    maxPrice: "",
    minMileage: "",
    maxMileage: "",
    minYear: "",
    maxYear: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  // Comparison
  comparisonList: [], // Car IDs to compare
  comparisonData: null,
  comparisonInsights: null,

  // Similar cars
  similarCars: [],

  // Trending cars
  trendingCars: [],

  // Loading states
  searchLoading: false,
  filterLoading: false,
  compareLoading: false,
  similarLoading: false,
  trendingLoading: false,

  // Errors
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setActiveFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
    },
    addToComparison: (state, action) => {
      if (
        state.comparisonList.length < 4 &&
        !state.comparisonList.includes(action.payload)
      ) {
        state.comparisonList.push(action.payload);
      }
    },
    removeFromComparison: (state, action) => {
      state.comparisonList = state.comparisonList.filter(
        (id) => id !== action.payload
      );
    },
    clearComparison: (state) => {
      state.comparisonList = [];
      state.comparisonData = null;
      state.comparisonInsights = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Advanced search
      .addCase(advancedSearch.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(advancedSearch.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.results = action.payload.cars;
        state.totalResults = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(advancedSearch.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Filter options
      .addCase(fetchFilterOptions.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterLoading = false;
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload;
      })

      // Compare cars
      .addCase(compareCars.pending, (state) => {
        state.compareLoading = true;
        state.error = null;
      })
      .addCase(compareCars.fulfilled, (state, action) => {
        state.compareLoading = false;
        state.comparisonData = action.payload.comparison;
        state.comparisonInsights = action.payload.insights;
      })
      .addCase(compareCars.rejected, (state, action) => {
        state.compareLoading = false;
        state.error = action.payload;
      })

      // Similar cars
      .addCase(fetchSimilarCars.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(fetchSimilarCars.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarCars = action.payload;
      })
      .addCase(fetchSimilarCars.rejected, (state, action) => {
        state.similarLoading = false;
        state.error = action.payload;
      })

      // Trending cars
      .addCase(fetchTrendingCars.pending, (state) => {
        state.trendingLoading = true;
      })
      .addCase(fetchTrendingCars.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trendingCars = action.payload;
      })
      .addCase(fetchTrendingCars.rejected, (state, action) => {
        state.trendingLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveFilters,
  clearFilters,
  addToComparison,
  removeFromComparison,
  clearComparison,
  clearError,
  setPage,
} = searchSlice.actions;

export default searchSlice.reducer;
