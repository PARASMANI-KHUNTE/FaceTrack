import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "add",
    initialState: {
      user: null,
      token: null,
      employeeName : null,
      employeePhone : null ,
      employeeEmail : null,
      employeeDepartment : null,
      employeeEmployer : null,
      employeeEmbedings : null,
      employeeTask : null ,
      employeeShift : null ,
    },
    reducers: {
      setCredentials: (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        localStorage.setItem('token',token)
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token')
      },
    },
  });
  
  export const { setCredentials, logout } = authSlice.actions;
  export default authSlice.reducer;