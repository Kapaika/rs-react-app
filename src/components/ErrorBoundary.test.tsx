import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import '@testing-library/jest-dom';

describe('Error Boundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>Normal Component</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component')).toBeInTheDocument();
  });
});

const Child = () => {
  throw new Error();
};

describe('Error Boundary', () => {
  const renderProviders = (ui: React.ReactElement) => render(ui, {});

  it(`should render error boundary component when there is an error`, () => {
    const { getByText } = renderProviders(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    const errorMessage = getByText('Something went wrong');
    expect(errorMessage).toBeDefined();
  });
});
