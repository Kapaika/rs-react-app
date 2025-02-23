import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useThemeContext } from '../contexts/ThemeContext';
import ThemeProvider from '../contexts/ThemeProvider';
import Flyout from './Flayout';
import store from '../store/store';

jest.mock('../contexts/themeContext', () => ({
  useThemeContext: jest.fn(),
}));

describe('Layout Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render Layout with light theme by default', () => {
    useThemeContext.mockReturnValue({ theme: 'white', toggleTheme: jest.fn() });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <Flyout />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId('layout')).toHaveClass('bg-white');
    expect(screen.getByTestId('layout')).toHaveClass('text-black');
  });

  it('should render Layout with dark theme', () => {
    // Mock the theme context to return the dark theme
    useThemeContext.mockReturnValue({ theme: 'black', toggleTheme: jest.fn() });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <Flyout />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId('layout')).toHaveClass('bg-black');
    expect(screen.getByTestId('layout')).toHaveClass('text-white');
  });

  it('should toggle theme when button is clicked', () => {
    const toggleTheme = jest.fn();
    useThemeContext.mockReturnValue({ theme: 'white', toggleTheme });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <Flyout />
        </ThemeProvider>
      </Provider>
    );

    const themeToggleButton = screen.getByText('Switch to Dark Mode');
    fireEvent.click(themeToggleButton);

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
