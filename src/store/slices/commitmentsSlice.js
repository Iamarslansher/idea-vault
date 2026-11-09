import { createSlice } from '@reduxjs/toolkit';
import { getStoredCommitments } from '../../services/storageService';

const initialState = {
  items: getStoredCommitments(),
};

const commitmentsSlice = createSlice({
  name: 'commitments',
  initialState,
  reducers: {
    setCommitments(state, action) {
      state.items = action.payload;
    },
    addCommitmentRecord(state, action) {
      state.items.unshift(action.payload);
    },
    updateCommitmentStatus(state, action) {
      const { id, status } = action.payload;
      const target = state.items.find(c => c.id === id);
      if (target) {
        target.status = status;
      }
    }
  },
});

export const { setCommitments, addCommitmentRecord, updateCommitmentStatus } = commitmentsSlice.actions;
export default commitmentsSlice.reducer;

