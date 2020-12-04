import React, { Component } from 'react';

import AES_MATRIX from './AES_Matrix';

/*
 * aes-js - https://developer.aliyun.com/mirror/npm/package/aes-js/v/3.0.0
 * AES Steps - https://zerofruit.medium.com/what-is-aes-step-by-step-fcb2ba41bb20
 */
class AES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: 128,
      rounds: 10
    };
    //todo: make all these arrays so the user can page through each round.
    this.initialMatrix = <p>todo</p>;
    this.roundKeyMatrix1 = <p>todo</p>;
    this.roundKeyMatrix2 = <p>todo</p>;
    this.substituteBytesMatrix = <p>todo</p>;
    this.shiftRowsMatrix = <p>todo</p>;
    this.mixColumnsMatrix = <p>todo</p>;
    this.input = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  encrypt(input) {
    console.log('The user inputed the following text to encrpt: ' + input);
    for (var i = 0; i < input.length; i += 16) {
      var textBytes = [];
      for (var j = 0; j < 16; j++) {
        //todo: manage empty values
        textBytes.push(input.charCodeAt(i + j));
      }
      var aesMatrix = this.createMatrix(textBytes);
      this.initialMatrix = this.displayMatrix(aesMatrix);

      // Add Round Key
      aesMatrix = this.addRoundKey(aesMatrix);
      this.roundKeyMatrix1 = this.displayMatrix(aesMatrix);

      for (let x = 1; x < this.state.rounds; x++) {
        // Substitute Bytes
        aesMatrix = this.substituteBytes(aesMatrix);
        this.substituteBytesMatrix = this.displayMatrix(aesMatrix);
        // Shift Rows
        aesMatrix = this.shiftRows(aesMatrix);
        this.shiftRowsMatrix = this.displayMatrix(aesMatrix);
        // Mix Columns
        aesMatrix = this.mixColumns(aesMatrix);
        this.mixColumnsMatrix = this.displayMatrix(aesMatrix);
        // Add Round Key (sub key)
        // todo
      }

      // Substitute Bytes
      aesMatrix = this.substituteBytes(aesMatrix);
      this.substituteBytesMatrix = this.displayMatrix(aesMatrix);
      // Shift Rows
      aesMatrix = this.shiftRows(aesMatrix);
      this.shiftRowsMatrix = this.displayMatrix(aesMatrix);
    }
  }

  createMatrix(bytes) {
    /* This is such a hack job but I guess it will do. */
    var matrix = [[], [], [], []];
    matrix[0][0] = bytes[0];
    matrix[0][1] = bytes[1];
    matrix[0][2] = bytes[2];
    matrix[0][3] = bytes[3];
    matrix[1][0] = bytes[4];
    matrix[1][1] = bytes[5];
    matrix[1][2] = bytes[6];
    matrix[1][3] = bytes[7];
    matrix[2][0] = bytes[8];
    matrix[2][1] = bytes[9];
    matrix[2][2] = bytes[10];
    matrix[2][3] = bytes[11];
    matrix[3][0] = bytes[12];
    matrix[3][1] = bytes[13];
    matrix[3][2] = bytes[14];
    matrix[3][3] = bytes[15];
    return matrix;
  }

  addRoundKey(matrix) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        matrix[i][j] = matrix[i][j] ^ this.state.key_128[4 * i + j];
      }
    }
    return matrix;
  }

  substituteBytes(matrix) {
    /* I've been having one hell of a time getting the syntax on this working...
       this prettier/prettier dependency thing is a complete peice of shit. 
       Anyway found this here: source: https://www.movable-type.co.uk/scripts/aes.html */
    // prettier-ignore
    var sBox = [
      0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
      0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
      0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
      0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
      0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
      0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
      0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
      0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
      0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
      0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
      0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
      0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
      0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
      0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
      0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
      0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        matrix[r][c] = sBox[matrix[r][c]];
      }
    }
    return matrix;
  }

  shiftRows(matrix) {
    /* This is also a hack job... */
    //Row 2
    var temp1 = matrix[1][0];
    matrix[1][0] = matrix[1][1];
    matrix[1][1] = matrix[1][2];
    matrix[1][2] = matrix[1][3];
    matrix[1][3] = temp1;
    //Row 3
    var temp2 = matrix[2][0];
    var temp3 = matrix[2][1];
    matrix[2][0] = matrix[2][2];
    matrix[2][1] = matrix[2][3];
    matrix[2][2] = temp2;
    matrix[2][3] = temp3;
    //Row 4
    var temp4 = matrix[3][0];
    matrix[3][0] = matrix[3][3];
    matrix[3][3] = matrix[3][2];
    matrix[3][2] = matrix[3][1];
    matrix[3][1] = temp4;
    return matrix;
  }

  mixColumns(matrix) {
    for (let c = 0; c < 4; c++) {
      const a = new Array(4);
      const b = new Array(4);
      for (let r = 0; r < 4; r++) {
        a[r] = matrix[r][c];
        // prettier-ignore
        b[r] = matrix[r][c] & 0x80 ? matrix[r][c] << 1 ^ 0x011b : matrix[r][c] << 1;
      }
      // a[n] ^ b[n] is a•{03} in GF(2^8)
      matrix[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // {02}•a0 + {03}•a1 + a2 + a3
      matrix[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 • {02}•a1 + {03}•a2 + a3
      matrix[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + {02}•a2 + {03}•a3
      matrix[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // {03}•a0 + a1 + a2 + {02}•a3
    }
    return matrix;
  }

  vectorMultiplication(matrix, vector) {
    var column = [];
    for (var i = 0; i < 4; i++) {
      var val = 0;
      for (var j = 0; j < 4; j++) {
        val += matrix[i][j] * vector[j];
      }
      column[i] = val;
    }
    return column;
  }

  shiftColumns(byteMatrix) {
    var newMatrix = [];
    for (var i = 0; i < 4; i++) {
      newMatrix[i] = this.vectorMultiplication(byteMatrix, byteMatrix[i]);
    }
    return newMatrix;
  }

  displayMatrix(matrix) {
    var renderObject = {
      col1: [matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0]],
      col2: [matrix[0][1], matrix[1][1], matrix[2][1], matrix[3][1]],
      col3: [matrix[0][2], matrix[1][2], matrix[2][2], matrix[3][2]],
      col4: [matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]],
      initialized: true
    };
    return <AES_MATRIX value={renderObject}></AES_MATRIX>;
  }

  handleChange(value) {
    var rounds = 0;
    if (value == 128) {
      rounds = 10;
    } else if (value == 192) {
      rounds = 12;
    } else if (value == 256) {
      rounds = 14;
    }
    this.setState({
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: value,
      rounds: value
    });
  }

  run = () => {
    this.encrypt(this.input.current.value);
    this.setState({
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: this.key_length
    });
  };

  render() {
    let initialMatrix = this.initialMatrix;
    let roundKeyMatrix1 = this.roundKeyMatrix1;
    let roundKeyMatrix2 = this.roundKeyMatrix2;
    let substituteBytesMatrix = this.substituteBytesMatrix;
    let shiftRowsMatrix = this.shiftRowsMatrix;
    let mixColumnsMatrix = this.mixColumnsMatrix;
    return (
      <div className="AES">
        <div>
          <h1>Encrypt: </h1>
          <input type="text" ref={this.input} />
          <select onChange={this.handleChange}>
            <option key="128" value="128">
              128
            </option>
            <option key="192" value="192">
              192
            </option>
            <option key="256" value="256">
              256
            </option>
          </select>
          <button onClick={this.run}>Start!</button>
        </div>
        <h1>Inital Matrix</h1>
        {initialMatrix}
        <h1>Add Round Key</h1>
        {roundKeyMatrix1}
        <h2>Substitute Bytes</h2>
        {substituteBytesMatrix}
        <h2>Shift Rows</h2>
        {shiftRowsMatrix}
        <h2>Mix Columns</h2>
        {mixColumnsMatrix}
        <h2>Add Round Key</h2>
        {roundKeyMatrix2}
      </div>
    );
  }
}

export default AES;
