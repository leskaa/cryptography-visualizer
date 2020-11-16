import React, { Component } from 'react';
import AES_MATRIX from './AES_Matrix';

class AES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      col1: ['A', 'B', 'C', 'D'],
      col2: ['A', 'B', 'C', 'D'],
      col3: ['A', 'B', 'C', 'D'],
      col4: ['A', 'B', 'C', 'D']
    };
  }

  setEncryptText(value) {
    this.setState({
      encrypt: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    });
  }

  render() {
    return (
      <div className="AES">
        <AES_MATRIX value={this.state}></AES_MATRIX>
      </div>
    );
  }
}

export default AES;
