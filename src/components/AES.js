import React, { Component } from 'react';
import AES_MATRIX from './AES_Matrix';

const data = {
  encrypt: 'abcdefghi'
};

class AES extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="AES">
        <AES_MATRIX {...data}></AES_MATRIX>
      </div>
    );
  }
}

export default AES;
