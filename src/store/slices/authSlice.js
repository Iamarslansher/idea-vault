import { createSlice } from '@reduxjs/toolkit';
import { getStoredUser } from '../../services/storageService';

const initialState = {
  user: getStoredUser(),
  isAuthenticated: Boolean(getStoredUser()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
    setAuthSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.loading = false;
      state.error = null;
    },
    setAuthError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
});

export const { setAuthLoading, setAuthSuccess, setAuthError, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;

