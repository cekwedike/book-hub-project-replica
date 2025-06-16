import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import searchReducer from './slices/searchSlice';
import filtersReducer from './slices/filtersSlice';
import userDataReducer from './slices/userDataSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    search: searchReducer,
    filters: filtersReducer,
    userData: userDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 