import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import employeeReducer from "./slices/employeeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
  },
});

export default store;