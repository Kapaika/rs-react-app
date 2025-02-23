import { useEffect, useState } from 'react';
import './App.css';
import TopControls from './components/TopControls';
import Results from './components/Results';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';
import ThemeProvider from './contexts/ThemeProvider';
import { useThemeContext } from './contexts/ThemeContext';
import { useFetchPeopleQuery } from './store/apiSlice';
import { useDispatch } from 'react-redux';
import { setFetchedResults } from './store/fetchedResultsSlice';

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

// Move ThemeContext logic to a child component
function ThemedApp() {
  const [errorKey, setErrorKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useFetchPeopleQuery(searchQuery);

  useEffect(() => {
    const storedQuery = localStorage.getItem('searchQuery');
    if (storedQuery) {
      setSearchQuery(storedQuery);
    }
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(
        setFetchedResults({
          results: data.results,
          nextPage: data?.next || null,
          previousPage: data?.previous || null,
        })
      );
    }
  }, [data, dispatch]);

  const makeAPICall = (query: string) => {
    setSearchQuery(query);
    localStorage.setItem('searchQuery', query); // Store the query in localStorage
  };

  const makeErrorCall = () => {
    setErrorKey((prev) => prev + 1);
  };

  return (
    <ThemeContainer>
      <TopControls getName={(name: string) => makeAPICall(name)} />
      {isLoading ? (
        <h2>🌀 Loading...</h2>
      ) : (
        <ErrorBoundary key={errorKey}>
          <Results></Results>
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
