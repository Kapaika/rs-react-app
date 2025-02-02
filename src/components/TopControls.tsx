import { Component } from 'react';
import Button from './Button';

interface TopControlsProps {
  query: string;
  getName: (name: string) => void;
}

class TopControls extends Component<TopControlsProps> {
  state = {
    searchValue: '',
  };

  componentDidMount(): void {
    const storedQuery = localStorage.getItem('searchQuery');
    if (storedQuery) {
      this.setState({ searchValue: storedQuery });
    }
  }

  componentDidUpdate(): void {
    console.log(this.props);
  }

  makeAnApicall = () => {
    this.props.getName(this.state.searchValue);
  };

  render() {
    return (
      <>
        <input
          value={this.state.searchValue}
          onChange={(event) =>
            this.setState({ searchValue: event.target.value })
          }
          className="px-50 py-3 text-black font-semibold rounded-lg shadow-md"
        ></input>
        <Button label="Search" onClick={this.makeAnApicall}></Button>
      </>
    );
  }
}

export default TopControls;
