import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './selectedItemsSlice';
import { apiSlice } from './apiSlice';
import fetchedResultsReducer from './fetchedResultsSlice';
import {
  addItem,
  removeItem,
  setSelectedItems,
  clearSelectedItems,
} from './selectedItemsSlice';
import { setFetchedResults } from './fetchedResultsSlice';

describe('Redux store configuration', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        selectedPersons: selectedItemsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        fetchedResults: fetchedResultsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    });
  });

  it('should handle selected items actions', () => {
    const person = {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    };

    store.dispatch(addItem(person));
    let selectedPersons = store.getState().selectedPersons.selectedPeople;
    expect(selectedPersons).toHaveLength(1);
    expect(selectedPersons[0]).toEqual(person);

    store.dispatch(removeItem(person));
    selectedPersons = store.getState().selectedPersons.selectedPeople;
    expect(selectedPersons).toHaveLength(0);

    const newSelectedItems = [
      { name: 'Leia Organa', url: 'https://swapi.dev/api/people/2/' },
      { name: 'Han Solo', url: 'https://swapi.dev/api/people/3/' },
    ];
    store.dispatch(setSelectedItems(newSelectedItems));
    selectedPersons = store.getState().selectedPersons.selectedPeople;
    expect(selectedPersons).toHaveLength(2);
    expect(selectedPersons).toEqual(newSelectedItems);

    store.dispatch(clearSelectedItems());
    selectedPersons = store.getState().selectedPersons.selectedPeople;
    expect(selectedPersons).toHaveLength(0);
  });

  it('should handle fetchedResults actions', () => {
    const resultsData = {
      results: [
        { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      ],
      nextPage: 'https://swapi.dev/api/people/?page=2',
      previousPage: null,
    };

    store.dispatch(setFetchedResults(resultsData));
    const fetchedResults = store.getState().fetchedResults;
    expect(fetchedResults.results).toHaveLength(1);
    expect(fetchedResults.results[0].name).toBe('Luke Skywalker');
    expect(fetchedResults.nextPage).toBe(
      'https://swapi.dev/api/people/?page=2'
    );
    expect(fetchedResults.previousPage).toBeNull();
  });

  it('should handle apiSlice actions', async () => {
    const searchTerm = 'Luke';
    const fetchResult = await store.dispatch(
      apiSlice.endpoints.fetchPeople.initiate(searchTerm)
    );

    const state = store.getState();
    const response = state.api.queries['fetchPeople("Luke")']?.data;

    expect(response).toBeDefined();
    expect(response?.results).toHaveLength(1);
    expect(response?.results[0].name).toBe('Luke Skywalker');
  });
});
