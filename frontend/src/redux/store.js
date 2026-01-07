import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carsReducer from "./slices/carsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    ui: uiReducer,
  },
});

export default store;
