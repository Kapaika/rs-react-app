import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import TopControls from './TopControls';

describe('TopControls Component', () => {
  it('renders input field and button', () => {
    render(
      <MemoryRouter>
        <TopControls getName={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(
      <MemoryRouter>
        <TopControls getName={jest.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Query' } });

    expect(input).toHaveValue('Test Query');
  });

  it('calls getName function with input value when button is clicked', () => {
    const mockGetName = jest.fn();

    render(
      <MemoryRouter>
        <TopControls getName={mockGetName} />
      </MemoryRouter>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React Testing' } });

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    expect(mockGetName).toHaveBeenCalledWith('React Testing');
  });

  it('loads initial search value from localStorage', () => {
    localStorage.setItem('searchQuery', 'Saved Query');

    render(
      <MemoryRouter>
        <TopControls getName={jest.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Saved Query');

    localStorage.removeItem('searchQuery'); // Cleanup
  });
});
