import fetchedResultsReducer, {
  setFetchedResults,
  clearFetchedResults,
} from './fetchedResultsSlice';
import { Person } from '../model/Person';

describe('fetchedResultsSlice', () => {
  const mockResults: Person[] = [
    {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
      height: '',
      mass: '',
      hair_color: '',
      skin_color: '',
      eye_color: '',
      birth_year: '',
      gender: '',
    },
    {
      name: 'Darth Vader',
      url: 'https://swapi.dev/api/people/2/',
      height: '',
      mass: '',
      hair_color: '',
      skin_color: '',
      eye_color: '',
      birth_year: '',
      gender: '',
    },
  ];

  const initialState = {
    results: null,
    nextPage: null,
    previousPage: null,
  };

  it('should handle setFetchedResults', () => {
    const action = setFetchedResults({
      results: mockResults,
      nextPage: 'https://swapi.dev/api/people/?page=2',
      previousPage: 'https://swapi.dev/api/people/?page=1',
    });

    const newState = fetchedResultsReducer(initialState, action);

    expect(newState.results).toEqual(mockResults);
    expect(newState.nextPage).toEqual('https://swapi.dev/api/people/?page=2');
    expect(newState.previousPage).toEqual(
      'https://swapi.dev/api/people/?page=1'
    );
  });

  it('should handle clearFetchedResults', () => {
    const stateWithData = {
      results: mockResults,
      nextPage: 'https://swapi.dev/api/people/?page=2',
      previousPage: 'https://swapi.dev/api/people/?page=1',
    };

    // Action to clear the state
    const action = clearFetchedResults();

    const newState = fetchedResultsReducer(stateWithData, action);

    expect(newState.results).toBeNull();
    expect(newState.nextPage).toBeNull();
    expect(newState.previousPage).toBeNull();
  });

  it('should return the initial state when no action is provided', () => {
    const newState = fetchedResultsReducer(undefined, { type: '' });

    expect(newState).toEqual(initialState);
  });
});
