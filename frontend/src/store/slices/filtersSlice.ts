import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FilterOptions } from '../../types';

interface FiltersState {
  filters: FilterOptions;
  availableGenres: string[];
  availableAuthors: string[];
  priceRange: {
    min: number;
    max: number;
  };
  yearRange: {
    min: number;
    max: number;
  };
}

const initialState: FiltersState = {
  filters: {
    genre: '',
    author: '',
    minRating: 0,
    maxPrice: 1000,
    minPrice: 0,
    publicationYear: '',
    sortBy: 'title',
    sortOrder: 'asc',
  },
  availableGenres: [],
  availableAuthors: [],
  priceRange: {
    min: 0,
    max: 1000,
  },
  yearRange: {
    min: 1900,
    max: new Date().getFullYear(),
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setGenre: (state, action: PayloadAction<string>) => {
      state.filters.genre = action.payload;
    },
    setAuthor: (state, action: PayloadAction<string>) => {
      state.filters.author = action.payload;
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.filters.minRating = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      state.priceRange = action.payload;
    },
    setPublicationYear: (state, action: PayloadAction<string>) => {
      state.filters.publicationYear = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterOptions['sortBy']>) => {
      state.filters.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<FilterOptions['sortOrder']>) => {
      state.filters.sortOrder = action.payload;
    },
    setAvailableGenres: (state, action: PayloadAction<string[]>) => {
      state.availableGenres = action.payload;
    },
    setAvailableAuthors: (state, action: PayloadAction<string[]>) => {
      state.availableAuthors = action.payload;
    },
    setYearRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.yearRange = action.payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setGenre,
  setAuthor,
  setRating,
  setPriceRange,
  setPublicationYear,
  setSortBy,
  setSortOrder,
  setAvailableGenres,
  setAvailableAuthors,
  setYearRange,
} = filtersSlice.actions;

export default filtersSlice.reducer; 