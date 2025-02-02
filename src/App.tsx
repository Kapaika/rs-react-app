import { Component } from 'react';
import './App.css';
import TopControls from './components/TopControls';
import Results from './components/Results';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';

interface AppState {
  items: [];
  isLoading: boolean;
  errorKey: number;
  storedQuery: string;
}

class App extends Component {
  SWAPI_LINK = 'https://swapi.dev/api/people?search=';
  state: AppState = {
    items: [],
    isLoading: false,
    errorKey: 0,
    storedQuery: '',
  };

  componentDidMount(): void {
    const storedQuery = localStorage.getItem('searchQuery');
    if (storedQuery) {
      this.makeAPICall(storedQuery);
      this.setState({ storedQuery: storedQuery });
    }
  }

  makeAPICall = (name: string) => {
    this.setState({
      items: [],
      isLoading: true,
      errorKey: this.state.errorKey + 1,
    });
    fetch(this.SWAPI_LINK + name)
      .then((response) => {
        if (!response) {
          this.setState({ items: null });
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ items: data.results, isLoading: false });
        localStorage.setItem('searchQuery', name);
      });
  };

  makeErrorCall = () => {
    fetch('https://jsonplaceholder.typicode.com/invalid-endpoint')
      .then((response) => {
        return response.json();
      })
      .then(() => {
        this.setState({ items: null });
      });
  };

  render() {
    return (
      <>
        <TopControls
          query={this.state.storedQuery}
          getName={(name: string) => this.makeAPICall(name)}
        ></TopControls>
        {this.state.isLoading ? (
          <h2>🌀 Loading...</h2>
        ) : (
          <ErrorBoundary key={this.state.errorKey}>
            <Results items={this.state.items} />
          </ErrorBoundary>
        )}
        <div className="flex justify-end mt-4">
          <Button label="Error Button" onClick={this.makeErrorCall} />
        </div>
      </>
    );
  }
}

export default App;
