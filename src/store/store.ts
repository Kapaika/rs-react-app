import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './selectedItemsSlice';
import { apiSlice } from './apiSlice';
import fetchedResultsReducer from './fetchedResultsSlice';

const store = configureStore({
  reducer: {
    selectedPersons: selectedItemsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    fetchedResults: fetchedResultsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
