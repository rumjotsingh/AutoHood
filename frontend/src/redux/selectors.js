// Common selectors to use throughout the application
// These provide optimized access to Redux state

// Auth Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Cars Selectors
export const selectAllCars = (state) => state.cars.cars;
export const selectCurrentCar = (state) => state.cars.currentCar;
export const selectSearchResults = (state) => state.cars.searchResults;
export const selectCarsPagination = (state) => state.cars.pagination;
export const selectCarsLoading = (state) => state.cars.loading;
export const selectCarsError = (state) => state.cars.error;

// UI Selectors
export const selectUILoading = (state) => state.ui.loading;
export const selectModalState = (state) => ({
  isOpen: state.ui.modalOpen,
  content: state.ui.modalContent,
});
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarState = (state) => state.ui.sidebarOpen;

// Combined Selectors
export const selectAuthState = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  token: state.auth.token,
  loading: state.auth.loading,
  error: state.auth.error,
});

export const selectCarsState = (state) => ({
  cars: state.cars.cars,
  currentCar: state.cars.currentCar,
  searchResults: state.cars.searchResults,
  pagination: state.cars.pagination,
  loading: state.cars.loading,
  error: state.cars.error,
});
