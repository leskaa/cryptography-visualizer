import React, { Component } from 'react';

import AES_MATRIX from './AES_Matrix';

/*
 * aes-js - https://developer.aliyun.com/mirror/npm/package/aes-js/v/3.0.0
 * AES Steps - https://zerofruit.medium.com/what-is-aes-step-by-step-fcb2ba41bb20
 * AES Steps - https://kavaliro.com/wp-content/uploads/2014/03/AES.pdf
 */
class AES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: 128,
      rounds: 10,
      page: 0,
      cipherText: ' ',
      view: false
    };
    //todo: make all these arrays so the user can page through each round.
    this.initialMatrix = <p>todo</p>;
    this.roundKeyMatrix1 = <p>todo</p>;
    this.substituteBytesMatrix = [];
    this.shiftRowsMatrix = [];
    this.mixColumnsMatrix = [];
    this.roundKeyMatrix2 = [];
    for (let x = 0; x < this.state.rounds; x++) {
      this.substituteBytesMatrix[x] = <p>todo</p>;
      this.shiftRowsMatrix[x] = <p>todo</p>;
      this.mixColumnsMatrix[x] = <p>todo</p>;
      this.roundKeyMatrix2[x] = <p>todo</p>;
    }
    this.input = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    /* I've been having one hell of a time getting the syntax on this working...
       this prettier/prettier dependency thing is a complete peice of shit. 
       Anyway found this here: https://www.movable-type.co.uk/scripts/aes.html */
    // prettier-ignore
    this.sBox = [
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
    // prettier-ignore
    this.exampleMatrix = [ ['b0', 'b4', 'b8', 'b12'], ['b1', 'b5', 'b9', 'b13'], ['b2', 'b6', 'b10', 'b14'], ['b3', 'b7', 'b11', 'b15']]
  }

  encrypt(input) {
    console.log('The user inputed the following text to encrpt: ' + input);

    this.exampleMatrix = this.displayMatrix(this.exampleMatrix);
    for (var i = 0; i < input.length; i += 16) {
      var textBytes = [];
      for (var j = 0; j < 16; j++) {
        if (!isNaN(input.charCodeAt(i + j))) {
          textBytes.push(input.charCodeAt(i + j));
        } else {
          textBytes.push(0);
        }
      }
      var key = this.keyExpansion(textBytes);
      var aesMatrix = this.createMatrix(textBytes);
      this.initialMatrix = this.displayMatrix(aesMatrix);

      // Add Round Key
      aesMatrix = this.addRoundKey(aesMatrix, key, 0);
      this.roundKeyMatrix1 = this.displayMatrix(aesMatrix);

      for (let x = 0; x < this.state.rounds - 1; x++) {
        // Substitute Bytes
        aesMatrix = this.substituteBytes(aesMatrix);
        this.substituteBytesMatrix[x] = this.displayMatrix(aesMatrix);
        // Shift Rows
        aesMatrix = this.shiftRows(aesMatrix);
        this.shiftRowsMatrix[x] = this.displayMatrix(aesMatrix);
        // Mix Columns
        aesMatrix = this.mixColumns(aesMatrix);
        this.mixColumnsMatrix[x] = this.displayMatrix(aesMatrix);
        // Add Round Key (sub key)
        aesMatrix = this.addRoundKey(aesMatrix, key, 0);
        this.roundKeyMatrix2[x] = this.displayMatrix(aesMatrix);
      }

      // Substitute Bytes
      aesMatrix = this.substituteBytes(aesMatrix);
      // prettier-ignore
      this.substituteBytesMatrix[this.state.rounds - 1] = this.displayMatrix(aesMatrix);
      // Shift Rows
      aesMatrix = this.shiftRows(aesMatrix);
      // prettier-ignore
      this.shiftRowsMatrix[this.state.rounds - 1] = this.displayMatrix(aesMatrix);
      // prettier-ignore
      this.mixColumnsMatrix[this.state.rounds - 1] = <p>todo: Mix Columns is not performed on the last Loop.</p>
      var cipherText = '';
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          console.log(String.fromCharCode(aesMatrix[i][j]));
          cipherText = cipherText + String.fromCharCode(aesMatrix[i][j]);
        }
      }
      return cipherText;
    }
  }

  keyExpansion(key) {
    const key_list = new Array(4 * (this.state.rounds + 1));
    for (let i = 0; i < this.state.rounds; i++) {
      // prettier-ignore
      key_list[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
    }
    for (let i = this.state.rounds; i < 4 * (this.state.rounds + 1); i++) {
      key_list[i] = new Array(4);
      let temp = new Array(4);
      for (let j = 0; j < 4; j++) {
        temp[j] = key_list[i - 1][j];
        if (i % this.state.rounds == 0) {
          const tmp = temp[0];
          for (let x = 0; x < 3; x++) {
            temp[x] = temp[x + 1];
          }
          temp[3] = tmp;
          for (let x = 0; x < 4; x++) {
            temp[x] = this.sBox[temp[x]];
          }
        } else if (this.state.rounds > 4 && i % this.state.rounds == 4) {
          for (let x = 0; x < 4; x++) {
            temp[i] = this.sBox[temp[i]];
          }
        }
        for (let x = 0; x < 4; x++) {
          key_list[i][x] = key_list[i - this.state.rounds][x] ^ temp[x];
        }
      }
    }
    return key_list;
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

  addRoundKey(matrix, key_list, round) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        matrix[i][j] = matrix[i][j] ^ key_list[4 * round + j][i];
      }
    }
    return matrix;
  }

  substituteBytes(matrix) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        matrix[r][c] = this.sBox[matrix[r][c]];
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
      // source: https://www.movable-type.co.uk/scripts/aes.html
      matrix[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
      matrix[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
      matrix[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
      matrix[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
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
      col4: [matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]]
    };
    return <AES_MATRIX value={renderObject}></AES_MATRIX>;
  }

  handleChange(value) {
    var rounds = 0;
    if (value === 128) {
      rounds = 10;
    } else if (value === 192) {
      rounds = 12;
    } else if (value === 256) {
      rounds = 14;
    }
    this.setState({
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: value,
      rounds: rounds,
      page: this.state.page,
      inpur: this.state.input,
      cipherText: this.state.cipherText,
      view: true
    });
  }

  run = () => {
    var cipherText = this.encrypt(this.input.current.value);
    this.setState({
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: this.state.key_length,
      rounds: this.state.rounds,
      page: this.state.page,
      input: this.input.current.value,
      cipherText: cipherText,
      view: true
    });
  };

  handleClick() {
    //todo: this is not actually working even though it is updating the matrix objects.
    console.log('The user is navigating to the next page');
    // prettier-ignore
    this.setState({
      key_128: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      key_length: this.state.key_length,
      rounds: this.state.rounds,
      page: this.state.page + 1,
      input: this.input.current.value,
      cipherText: this.state.cipherText,
      view: true
    });
  }

  render() {
    let page = this.state.page;
    let initialMatrix = this.initialMatrix;
    let roundKeyMatrix1 = this.roundKeyMatrix1;
    let substituteBytesMatrix = this.substituteBytesMatrix[page];
    let shiftRowsMatrix = this.shiftRowsMatrix[page];
    let mixColumnsMatrix = this.mixColumnsMatrix[page];
    let roundKeyMatrix2 = this.roundKeyMatrix2[page];
    let cipherText = this.state.cipherText;
    let view = this.state.view;
    let exampleMatrix = this.exampleMatrix;
    let rounds = this.state.rounds;
    if (view) {
      // prettier-ignore
      return (
        <div className="AES" align="center">
          <div>
            <h1 class="aesH1">AES - Advanced Encryption Standard</h1>
          </div>
          <div class="row justify-content-md-center">
            <label for="plainText" class="col-form-label">Plain Text:</label>
            <div class="col-sm-8">
              <input id="plainText" class="form-control" type="text" ref={this.input} />
            </div>
            <label for="keySize" class="col-form-label">Key Size:</label>
            <div class="col-sm-1">
              <select id="keySize" class="form-control" onChange={this.handleChange}>
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
            </div>
            <button class="btn btn-outline-dark" onClick={this.run}>Encrypt!</button>
          </div>
          <div class="row justify-content-md-center">
            <label for="cipherText" class="col-form-label">Cipher Text:</label>
            <div class="col-sm-4">
              <input type="text" readonly class="form-control" id="cipherText" value={cipherText}></input>
            </div>
          </div>
          <hr />
          <div>
            <h1>Step By Step Process:</h1>
          </div>
          <div class="row">
            <div class="col">
              <h2>Inital Matrix</h2>
              {exampleMatrix}
              <p>
                AES encrypts data in 16 byte chunks split up into 4 x 4 matrices like the one 
                above. The bytes are ordered via columns with the first byte of the text in b0, 
                the second bit in b2, and so on. By converting the characters of our plain text 
                to UTF-8 encoding, we can see our initial matrix on our right.
              </p>
            </div>
            <div class="col">{initialMatrix}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col">
              <h2>Add Round Key</h2>
              <p>
                The first step is to add a round key. This means performing an XOR operation on 
                the matrix. This is done by comparing the corresponding bits of the key to the
                plain text. If both the bits are the same the resulting bit will become a 0 if
                they are different the bit will become a 1.
              </p>
            </div>
            <div class="col">{roundKeyMatrix1}</div>
          </div>
          <hr />
          <p>
            The following combination of functions is performed for {rounds} rounds.
          </p>
          <button class="btn btn-outline-dark" onClick={this.handleClick}>Previous Page</button>
          <button class="btn btn-outline-dark" onClick={this.handleClick}>Next Page</button>
          <hr />
          <div class="row">
            <div class="col">
              <h2>Substitute Bytes</h2>
              <p>
                In this step each byte is substituted with a corresponding byte found in a table known
                as the <a href="https://en.wikipedia.org/wiki/Rijndael_S-box">S-BOX</a>.
              </p>
            </div>
            <div class="col">{substituteBytesMatrix}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col">
              <h2>Shift Rows</h2>
              <p>
                The rows are shifted following these rules:
              </p>
              <ul align="left">
                <li>Nothing is changed in the first row.</li>
                <li>In row 2 each cell is shifted to the left one step.</li>
                <li>In row 3 each cell is shifted to the left two steps.</li>
                <li>In row 4 each cell is shifted to the left three steps. (One step to the right)</li>
              </ul>
            </div>
            <div class="col">{shiftRowsMatrix}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col">
              <h2>Mix Columns</h2>
              <p>
                In this step matrix-vector multiplication is performed. This is done by taking one column
                multiplying it by a predefined <a href="https://en.wikipedia.org/wiki/MDS_matrix">circulant 
                MD5 matrix</a>. This step is not performed on the last round.
              </p>
            </div>
            <div class="col">{mixColumnsMatrix}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col">
              <h2>Add Round Key</h2>
              <p>
                Similar to the first step a round key is added, but this time a subkey is used instead of
                the private key.
              </p>
            </div>
            <div class="col">{roundKeyMatrix2}</div>
          </div>
          <hr />
        <button class="btn btn-outline-dark" onClick={this.handleClick}>Previous Page</button>
        <button class="btn btn-outline-dark" onClick={this.handleClick}>Next Page</button>
          <hr />
        <div class="row justify-content-md-center">
            <label for="cipherText" class="col-form-label">Cipher Text:</label>
            <div class="col-sm-4">
              <input type="text" readonly class="form-control" id="cipherText" value={cipherText}></input>
            </div>
          </div>
          <hr />
          <div class="row justify-content-md-center">
            <p>
              Source: <a href="https://zerofruit.medium.com/what-is-aes-step-by-step-fcb2ba41bb20">https://zerofruit.medium.com/what-is-aes-step-by-step-fcb2ba41bb20</a>
            </p>
          </div>
        </div>
      );
    } else {
      // prettier-ignore
      return (
        <div className="AES" align="center">
          <div>
            <h1 class="aesH1">AES - Advanced Encryption Standard</h1>
          </div>
          <div class="row justify-content-md-center">
            <label for="plainText" class="col-form-label">Plain Text:</label>
            <div class="col-sm-8">
              <input id="plainText" class="form-control" type="text" ref={this.input} />
            </div>
            <label for="keySize" class="col-form-label">Key Size:</label>
            <div class="col-sm-1">
              <select id="keySize" class="form-control" onChange={this.handleChange}>
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
            </div>
            <button class="btn btn-outline-dark" onClick={this.run}>Encrypt!</button>
          </div>
        </div>
      )
    }
  }
}

export default AES;
