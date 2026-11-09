import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'init-notif-1',
      type: 'welcome',
      title: 'Welcome to IdeaVault! 🚀',
      message: 'Explore vetted Pakistani & global business blueprints, calculate budgets in PKR, and find collaborators.',
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      read: false
    }
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload;
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
    },
    markAllAsRead(state) {
      state.items = state.items.map(n => ({ ...n, read: true }));
    },
    markOneAsRead(state, action) {
      const target = state.items.find(n => n.id === action.payload);
      if (target) target.read = true;
    },
    clearNotifications(state) {
      state.items = [];
    }
  },
});

export const { setNotifications, addNotification, markAllAsRead, markOneAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;

