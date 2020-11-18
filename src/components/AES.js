import React, { Component } from 'react';
import AES_MATRIX from './AES_Matrix';

var sizeof = require('object-sizeof');

class AES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      col1: ['A', 'B', 'C', 'D'],
      col2: ['A', 'B', 'C', 'D'],
      col3: ['A', 'B', 'C', 'D'],
      col4: ['A', 'B', 'C', 'D']
    };
    this.input = 'Hello World';
  }

  setEncryptText(value) {
    this.setState({
      encrypt: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    });
  }

  encrypt(input) {
    var blocks = [];
    var temp = true;
    while (temp) {
      var matrix = [];
      var i = 0;
      while (sizeof(matrix) < 16) {
        matrix.push(input.charCodeAt(i));
        i++;
      }
      blocks.push(matrix);
      temp = false;
    }
  }

  render() {
    return (
      <div className="AES">
        <button onClick={this.encrypt(this.input)}>Test</button>
        <AES_MATRIX value={this.state}></AES_MATRIX>
      </div>
    );
  }
}

export default AES;
