import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Person } from '../model/Person';

interface FetchedResultsState {
  results: Person[] | null;
  nextPage: string | null;
  previousPage: string | null;
}

const initialState: FetchedResultsState = {
  results: null,
  nextPage: null,
  previousPage: null,
};

const fetchedResultsSlice = createSlice({
  name: 'fetchedResults',
  initialState,
  reducers: {
    setFetchedResults: (
      state,
      action: PayloadAction<{
        results: Person[];
        nextPage: string | null;
        previousPage: string | null;
      }>
    ) => {
      state.results = action.payload.results;
      state.nextPage = action.payload.nextPage;
      state.previousPage = action.payload.previousPage;
    },
    clearFetchedResults: (state) => {
      state.results = null;
      state.nextPage = null;
      state.previousPage = null;
    },
  },
});

export const { setFetchedResults, clearFetchedResults } =
  fetchedResultsSlice.actions;
export default fetchedResultsSlice.reducer;
