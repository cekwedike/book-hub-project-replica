import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { bookApi } from '../../utils/api';
import type { Book, ApiResponse } from '../../types';

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
  selectedBook: Book | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: true,
  },
  selectedBook: null,
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params: { page?: number; limit?: number; filters?: any } = {}, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Book[]> = await bookApi.getBooks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Book> = await bookApi.getBookById(bookId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch book');
    }
  }
);

export const loadMoreBooks = createAsyncThunk(
  'books/loadMoreBooks',
  async (params: { page: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Book[]> = await bookApi.getBooks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more books');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.books = [];
      state.pagination = initialState.pagination;
    },
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
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
      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.data;
        state.pagination = {
          currentPage: action.payload.pagination?.currentPage || 1,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalItems: action.payload.pagination?.totalItems || 0,
          hasMore: action.payload.pagination?.hasNextPage || false,
        };
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload.data;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load more books
      .addCase(loadMoreBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = [...state.books, ...action.payload.data];
        state.pagination = {
          currentPage: action.payload.pagination?.currentPage || state.pagination.currentPage,
          totalPages: action.payload.pagination?.totalPages || state.pagination.totalPages,
          totalItems: action.payload.pagination?.totalItems || state.pagination.totalItems,
          hasMore: action.payload.pagination?.hasNextPage || false,
        };
      })
      .addCase(loadMoreBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBooks, setSelectedBook, clearError, resetPagination } = booksSlice.actions;
export default booksSlice.reducer; 