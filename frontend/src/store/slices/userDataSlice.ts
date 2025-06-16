import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../../utils/api';
import type { Book } from '../../types';

interface UserDataState {
  favorites: Book[];
  wishlist: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: UserDataState = {
  favorites: [],
  wishlist: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'userData/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getFavorites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch favorites');
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  'userData/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getWishlist();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.favorites = [];
      state.wishlist = [];
      state.error = null;
    },
    setFavorites: (state, action: PayloadAction<Book[]>) => {
      state.favorites = action.payload;
    },
    setWishlist: (state, action: PayloadAction<Book[]>) => {
      state.wishlist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData, setFavorites, setWishlist } = userDataSlice.actions;
export default userDataSlice.reducer; 