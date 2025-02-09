import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Results from './Results';
import { Person } from '../model/Person'; // Adjust import path if necessary
import '@testing-library/jest-dom'; // Import for jest-dom matchers
import { Route, Routes, useParams } from 'react-router';
import { MemoryRouter } from 'react-router';

global.fetch = jest.fn() as jest.Mock;

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

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
