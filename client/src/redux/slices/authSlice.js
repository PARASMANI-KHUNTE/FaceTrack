import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
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