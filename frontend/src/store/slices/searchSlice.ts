import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { bookApi } from '../../utils/api';
import type { Book, ApiResponse } from '../../types';

interface SearchState {
  query: string;
  searchResults: Book[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
  searchHistory: string[];
}

const initialState: SearchState = {
  query: '',
  searchResults: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: true,
  },
  searchHistory: [],
};

// Async thunks
export const searchBooks = createAsyncThunk(
  'search/searchBooks',
  async (params: { query: string; page?: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Book[]> = await bookApi.searchBooks(params.query, params.filters);
      return { ...response, query: params.query };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search books');
    }
  }
);

export const loadMoreSearchResults = createAsyncThunk(
  'search/loadMoreSearchResults',
  async (params: { query: string; page: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Book[]> = await bookApi.searchBooks(params.query, params.filters);
      return { ...response, query: params.query };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more search results');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.searchResults = [];
      state.pagination = initialState.pagination;
    },
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory = [query, ...state.searchHistory.slice(0, 9)]; // Keep last 10 searches
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search books
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.query = action.payload.query;
        state.pagination = {
          currentPage: action.payload.pagination?.currentPage || 1,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalItems: action.payload.pagination?.totalItems || 0,
          hasMore: action.payload.pagination?.hasNextPage || false,
        };
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load more search results
      .addCase(loadMoreSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = [...state.searchResults, ...action.payload.data];
        state.pagination = {
          currentPage: action.payload.pagination?.currentPage || state.pagination.currentPage,
          totalPages: action.payload.pagination?.totalPages || state.pagination.totalPages,
          totalItems: action.payload.pagination?.totalItems || state.pagination.totalItems,
          hasMore: action.payload.pagination?.hasNextPage || false,
        };
      })
      .addCase(loadMoreSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setQuery, 
  clearSearch, 
  addToSearchHistory, 
  clearSearchHistory, 
  clearError, 
  resetPagination 
} = searchSlice.actions;

export default searchSlice.reducer; 