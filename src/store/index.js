import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ideasReducer from './slices/ideasSlice';
import commitmentsReducer from './slices/commitmentsSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    commitments: commitmentsReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

