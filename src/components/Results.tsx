import { Component } from 'react';
import { Person } from '../model/Person';

interface ResultsProps {
  items: Person[];
}

class Results extends Component<ResultsProps> {
  render() {
    if (this.props.items === null) {
      throw new Error();
    }
    return (
      <div>
        <h2 className="text-xl mb-4">Results</h2>
        <ul className="space-y-2">
          {this.props.items.length > 0 ? (
            this.props.items.map((item, index) => (
              <li
                key={index}
                className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-200"
              >
                {item.name}
              </li>
            ))
          ) : (
            <li>No results available</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Results;
