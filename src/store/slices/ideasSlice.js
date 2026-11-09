import { createSlice } from '@reduxjs/toolkit';
import { getStoredIdeas } from '../../services/storageService';

const getInitialBookmarks = () => {
  try {
    const raw = localStorage.getItem('ideavault_bookmarks_v1');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  items: getStoredIdeas(),
  status: 'idle',
  error: null,
  activeCategory: 'all',
  searchQuery: '',
  selectedLocation: 'All Locations',
  selectedBusinessType: 'all',
  selectedBudgetTier: 'all',
  customMinBudget: '',
  customMaxBudget: '',
  sortBy: 'recent', // 'recent' | 'likes' | 'views' | 'budget-low' | 'budget-high'
  bookmarks: getInitialBookmarks(),
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    setIdeas(state, action) {
      state.items = action.payload;
    },
    addIdea(state, action) {
      state.items.unshift(action.payload);
    },
    updateIdea(state, action) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    deleteIdea(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    toggleLikeLocal(state, action) {
      const { ideaId, userId } = action.payload;
      const target = state.items.find(i => i.id === ideaId);
      if (target) {
        if (!Array.isArray(target.likedBy)) target.likedBy = [];
        const isLiked = target.likedBy.includes(userId);
        if (isLiked) {
          target.likedBy = target.likedBy.filter(id => id !== userId);
          target.likesCount = Math.max(0, (target.likesCount || 1) - 1);
        } else {
          target.likedBy.push(userId);
          target.likesCount = (target.likesCount || 0) + 1;
        }
      }
    },
    toggleBookmark(state, action) {
      const ideaId = action.payload;
      if (state.bookmarks.includes(ideaId)) {
        state.bookmarks = state.bookmarks.filter(id => id !== ideaId);
      } else {
        state.bookmarks.push(ideaId);
      }
      try {
        localStorage.setItem('ideavault_bookmarks_v1', JSON.stringify(state.bookmarks));
      } catch (e) {
        // ignore
      }
    },
    incrementViewsLocal(state, action) {
      const ideaId = action.payload;
      const target = state.items.find(i => i.id === ideaId);
      if (target) {
        target.viewsCount = (target.viewsCount || 0) + 1;
      }
    },
    addCommentLocal(state, action) {
      const { ideaId, comment } = action.payload;
      const target = state.items.find(i => i.id === ideaId);
      if (target) {
        if (!Array.isArray(target.comments)) target.comments = [];
        target.comments.unshift(comment);
        target.commentsCount = target.comments.length;
      }
    },
    addCommitmentLocal(state, action) {
      const { ideaId, commitment } = action.payload;
      const target = state.items.find(i => i.id === ideaId);
      if (target) {
        if (!Array.isArray(target.commitments)) target.commitments = [];
        target.commitments.unshift(commitment);
        target.commitmentsCount = target.commitments.length;
      }
    },
    setFilters(state, action) {
      return { ...state, ...action.payload };
    },
    resetFilters(state) {
      state.activeCategory = 'all';
      state.searchQuery = '';
      state.selectedLocation = 'All Locations';
      state.selectedBusinessType = 'all';
      state.selectedBudgetTier = 'all';
      state.customMinBudget = '';
      state.customMaxBudget = '';
      state.sortBy = 'recent';
    }
  },
});

export const {
  setIdeas,
  addIdea,
  updateIdea,
  deleteIdea,
  toggleLikeLocal,
  toggleBookmark,
  incrementViewsLocal,
  addCommentLocal,
  addCommitmentLocal,
  setFilters,
  resetFilters
} = ideasSlice.actions;

export default ideasSlice.reducer;

