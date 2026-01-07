import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carsReducer from "./slices/carsSlice";
import uiReducer from "./slices/uiSlice";
import favoritesReducer from "./slices/favoritesSlice";
import searchReducer from "./slices/searchSlice";
import inquiriesReducer from "./slices/inquiriesSlice";
import analyticsReducer from "./slices/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    ui: uiReducer,
    favorites: favoritesReducer,
    search: searchReducer,
    inquiries: inquiriesReducer,
    analytics: analyticsReducer,
  },
});

export default store;
