import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Results from './Results';
import { useThemeContext } from '../contexts/ThemeContext';
import { addItem, removeItem } from '../store/selectedItemsSlice';
import { useDispatch, useSelector } from 'react-redux';
import store from '../store/store';

global.fetch = jest.fn() as jest.Mock;

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

jest.mock('../contexts/ThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('Results Component', () => {
  const mockDispatch = jest.fn();
  const mockResults = [
    {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    },
    {
      name: 'Darth Vader',
      url: 'https://swapi.dev/api/people/2/',
    },
  ];

  beforeEach(() => {
    // Mock dispatch to use a jest function
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectedItems.selectedPeople') {
        return []; // Simulate no selected items
      }
      if (selector.name === 'fetchedResults.results') {
        return mockResults;
      }
      return null;
    });

    jest.clearAllMocks();
  });

  it('renders the results and checkboxes correctly', () => {
    useThemeContext.mockReturnValue({ theme: 'white', toggleTheme: jest.fn() });

    render(
      <Provider store={store}>
        <Results />
      </Provider>
    );

    // Check if the results are being rendered correctly
    mockResults.forEach((person) => {
      expect(screen.getByText(person.name)).toBeInTheDocument();
    });

    // Check if the checkboxes are rendered
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockResults.length);
  });

  it('dispatches addItem when a checkbox is clicked', () => {
    useThemeContext.mockReturnValue({ theme: 'white', toggleTheme: jest.fn() });

    render(
      <Provider store={store}>
        <Results />
      </Provider>
    );

    const checkbox = screen.getByLabelText('Luke Skywalker');
    fireEvent.click(checkbox); // Simulate a click on the checkbox

    // Expect the `addItem` action to be dispatched for this person
    expect(mockDispatch).toHaveBeenCalledWith(addItem(mockResults[0]));
  });

  it('dispatches removeItem when a checkbox is clicked again', () => {
    useThemeContext.mockReturnValue({ theme: 'white', toggleTheme: jest.fn() });

    // Mock the Redux state to have the item already selected
    useSelector.mockImplementationOnce((selector) => {
      if (selector.name === 'selectedItems.selectedPeople') {
        return [mockResults[0]];
      }
      if (selector.name === 'fetchedResults.results') {
        return mockResults;
      }
      return null;
    });

    render(
      <Provider store={store}>
        <Results />
      </Provider>
    );

    const checkbox = screen.getByLabelText('Luke Skywalker');
    fireEvent.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledWith(removeItem(mockResults[0]));
  });

  it('displays the loading message while fetching data', () => {
    useThemeContext.mockReturnValue({ theme: 'white', toggleTheme: jest.fn() });

    useSelector.mockImplementationOnce((selector) => {
      if (selector.name === 'fetchedResults.results') {
        return null;
      }
      return null;
    });

    render(
      <Provider store={store}>
        <Results />
      </Provider>
    );

    expect(screen.getByText('🌀 Loading...')).toBeInTheDocument();
  });
});

describe('Results Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a list of persons', async () => {
    const mockData = {
      results: [
        new Person(
          'Person 1',
          '180',
          '80',
          'Black',
          'Fair',
          'Brown',
          '1990',
          'Male',
          'https://api.example.com/1'
        ),
        new Person(
          'Person 2',
          '170',
          '60',
          'Blonde',
          'Fair',
          'Blue',
          '1985',
          'Female',
          'https://api.example.com/2'
        ),
      ],
      next: 'https://api.example.com/page/2',
      previous: null,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    (useParams as jest.Mock).mockReturnValue({
      characterId: '123',
      pageId: '1',
    });

    render(
      <MemoryRouter initialEntries={['/page/1']}>
        <Routes>
          <Route
            path="/page/:pageNumber"
            element={
              <Results
                initialItems={mockData.results}
                initialNextPage={mockData.next}
                initialPreviousPage={mockData.previous}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Person 1'));

    // Now `toBeInTheDocument` will work because of the jest-dom import
    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.getByText('Person 2')).toBeInTheDocument();
  });

  it('handles no results gracefully', async () => {
    const mockData = { results: [], next: null, previous: null };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    (useParams as jest.Mock).mockReturnValue({
      characterId: '123',
      pageId: '1',
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <Results
                initialItems={mockData.results}
                initialNextPage={mockData.next}
                initialPreviousPage={mockData.previous}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('No results available'));

    expect(screen.getByText('No results available')).toBeInTheDocument();
  });

  it('can navigate to next page when there is a nextPage', async () => {
    const mockData = {
      results: [
        new Person(
          'Person 1',
          '180',
          '80',
          'Black',
          'Fair',
          'Brown',
          '1990',
          'Male',
          'https://api.example.com/1'
        ),
      ],
      next: 'https://api.example.com/peaople/?search=L&page=2',
      previous: null,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    (useParams as jest.Mock).mockReturnValue({
      characterId: '123',
      pageId: '1',
    });

    render(
      <MemoryRouter initialEntries={['/page/1']}>
        <Routes>
          <Route
            path="/page/:pageNumber"
            element={
              <Results
                initialItems={mockData.results}
                initialNextPage={mockData.next}
                initialPreviousPage={mockData.previous}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Person 1'));

    // Update the text match to the full button text "Next >"
    const nextButton = screen.getByText('Next >');
    fireEvent.click(nextButton);

    expect(fetch).toHaveBeenCalledWith(mockData.next);
  });
});
