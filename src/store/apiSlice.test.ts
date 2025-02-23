import { apiSlice } from './apiSlice';
import { configureStore } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react';

describe('apiSlice', () => {
  it('fetches people successfully with the correct data', async () => {
    const store = configureStore({
      reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    });

    const result = store.dispatch(
      apiSlice.endpoints.fetchPeople.initiate('Luke')
    );

    await waitFor(() => result);

    // Retrieve the state from the store
    const state = store.getState();
    const response = state.api.queries['fetchPeople("Luke")']?.data;

    expect(response).toBeDefined();
    expect(response?.results).toHaveLength(2); // Check number of results
    expect(response?.results[0].name).toBe('Luke Skywalker'); // Check first name
    expect(response?.results[1].name).toBe('Darth Vader'); // Check second name
  });

  it('should handle fetchPeople with no results', async () => {
    const store = configureStore({
      reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // Add apiSlice reducer here
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware), // Add apiSlice middleware
    });

    // Dispatch with no search term
    const result = store.dispatch(apiSlice.endpoints.fetchPeople.initiate(''));

    await waitFor(() => result);

    const state = store.getState();
    const response = state.api.queries['fetchPeople("")']?.data;

    expect(response).toBeDefined();
    expect(response?.results).toHaveLength(0); // Ensure no results
  });

  it('should handle a failed fetchPeople request', async () => {
    const store = configureStore({
      reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    });

    const result = store.dispatch(
      apiSlice.endpoints.fetchPeople.initiate('InvalidSearch')
    );

    await waitFor(() => result);

    const state = store.getState();
    const error = state.api.queries['fetchPeople("InvalidSearch")']?.error;

    expect(error).toBeDefined();
  });
});
