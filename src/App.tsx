import { useEffect, useState } from 'react';
import './App.css';
import TopControls from './components/TopControls';
import Results from './components/Results';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';
import { Person } from './model/Person';

export default function App() {
  const SWAPI_LINK = 'https://swapi.dev/api/people?search=';
  const [items, setItems] = useState<Person[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [storedQuery, setStoredQuery] = useState('');

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
    <>
      <TopControls getName={(name: string) => makeAPICall(name)}></TopControls>
      {isLoading ? (
        <h2>🌀 Loading...</h2>
      ) : (
        <ErrorBoundary key={errorKey}>
          <Results items={items} />
        </ErrorBoundary>
      )}
      <div className="flex justify-end mt-4">
        <Button label="Error Button" onClick={makeErrorCall} />
      </div>
    </>
  );
}
