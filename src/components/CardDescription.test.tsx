import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardDescription from './CardDescription';
import { MemoryRouter, Routes, Route } from 'react-router';
import '@testing-library/jest-dom';
import { Person } from '../model/Person';

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () =>
      new Person('luke', 's', 'f', 'luke', 's', 'f', 'luke', 's', 'f'),
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
  } as unknown as Response)
);

const mockCharacter = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'Blond',
  skin_color: 'Fair',
  eye_color: 'Blue',
  birth_year: '19BBY',
  gender: 'Male',
  url: 'https://swapi.dev/api/people/1/',
};

describe('CardDescription Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with default UI', () => {
    render(
      <MemoryRouter initialEntries={['/page/1/character/1']}>
        <Routes>
          <Route
            path="/page/:pageNumber/character/:characterId"
            element={<CardDescription />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('🌀 Loading...')).toBeInTheDocument();
  });

  test('fetches and displays character details', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCharacter,
    });

    render(
      <MemoryRouter initialEntries={['/page/1/character/1']}>
        <Routes>
          <Route
            path="/page/:pageNumber/character/:characterId"
            element={<CardDescription />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    );

    expect(screen.getByText('Height:')).toBeInTheDocument();
    expect(screen.getByText('172')).toBeInTheDocument();
  });

  test('handles API fetch error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error logs

    render(
      <MemoryRouter initialEntries={['/page/1/character/1']}>
        <Routes>
          <Route
            path="/page/:pageNumber/character/:characterId"
            element={<CardDescription />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(console.error).toHaveBeenCalled()); // Ensure error is logged
  });

  test('fetches data and close it by X', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCharacter,
    });

    render(
      <MemoryRouter initialEntries={['/page/1/character/1']}>
        <Routes>
          <Route
            path="/page/:pageNumber/character/:characterId"
            element={<CardDescription />}
          />
          <Route path="/page/1" element={<div>Back to List</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('❌')).toBeInTheDocument());

    const closeButton = screen.getByText('❌');
    userEvent.click(closeButton);

    await waitFor(() => expect(screen.getByText('Back to List')).toBeVisible());
  });
});
