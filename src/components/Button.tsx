import { Component } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

class Button extends Component<ButtonProps> {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        className="px-6 py-2 ml-2 text-black font-semibold rounded-lg shadow-md"
      >
        {this.props.label}
      </button>
    );
  }
}

export default Button;
