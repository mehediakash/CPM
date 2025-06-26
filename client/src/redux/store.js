import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import parcelReducer from "./slices/parcelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcel: parcelReducer,
  },
});
