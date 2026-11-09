import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthModalOpen: false,
  authModalTab: 'login', // 'login' | 'signup'
  authModalIntent: '',
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal(state, action) {
      state.isAuthModalOpen = true;
      state.authModalIntent = action.payload?.intent || 'Please sign in or create an account to proceed.';
      if (action.payload?.tab) {
        state.authModalTab = action.payload.tab;
      }
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false;
      state.authModalIntent = '';
    },
    setAuthModalTab(state, action) {
      state.authModalTab = action.payload;
    },
    toggleSidebar(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setMobileSidebarOpen(state, action) {
      state.isMobileSidebarOpen = action.payload;
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthModalTab,
  toggleSidebar,
  setMobileSidebarOpen
} = uiSlice.actions;

export default uiSlice.reducer;

