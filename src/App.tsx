import { useEffect, useState } from 'react';
import './App.css';
import TopControls from './components/TopControls';
import Results from './components/Results';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';
import { Person } from './model/Person';
import ThemeProvider from './contexts/ThemeProvider';
import { useThemeContext } from './contexts/themeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

// Move ThemeContext logic to a child component
function ThemedApp() {
  const SWAPI_LINK = 'https://swapi.dev/api/people?search=';
  const [items, setItems] = useState<Person[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [storedQuery, setStoredQuery] = useState('');
  const [nextPage, setNextPage] = useState<string | null>('');
  const [previousPage, setPreviousPage] = useState<string | null>('');

  useEffect(() => {
    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
      setStoredQuery(searchQuery);
      makeAPICall(searchQuery);
    }
  }, [storedQuery]);

  const makeAPICall = (name: string) => {
    setItems([]);
    setIsLoading(true);
    setErrorKey((errorKey) => errorKey + 1);
    fetch(SWAPI_LINK + name)
      .then((response) => {
        if (!response) {
          setItems(null);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPreviousPage(data.previous);
        setNextPage(data.next);
        setItems(data.results);
        setIsLoading(false);
        localStorage.setItem('searchQuery', name);
      });
  };

  const makeErrorCall = () => {
    fetch('https://jsonplaceholder.typicode.com/invalid-endpoint')
      .then((response) => {
        return response.json();
      })
      .then(() => {
        setItems(null);
      });
  };

  return (
    <ThemeContainer>
      <TopControls getName={(name: string) => makeAPICall(name)} />
      {isLoading ? (
        <h2>🌀 Loading...</h2>
      ) : (
        <ErrorBoundary key={errorKey}>
          <Results
            initialItems={items}
            initialNextPage={nextPage}
            initialPreviousPage={previousPage}
          />
        </ErrorBoundary>
      )}
      <div className="flex justify-end mt-4">
        <Button label="Error Button" onClick={makeErrorCall} />
      </div>
    </ThemeContainer>
  );
}

// Separate Theme-based Styling
function ThemeContainer({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext();

  const appStyles = {
    backgroundColor: theme === 'white' ? 'white' : 'black',
    color: theme === 'white' ? 'black' : 'white',
    minHeight: '100vh',
    padding: '20px',
  };

  return <div style={appStyles}>{children}</div>;
}
