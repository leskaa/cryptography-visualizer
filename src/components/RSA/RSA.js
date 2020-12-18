import React, { Component } from 'react';
import { Typography, Input, Button, Row, Col, Radio, Select } from 'antd';
import { generateKey, toPem, encrypt, decrypt, exportPrivateKey,
        exportPublicKey, arrayBufferToBase64, base64ToArrayBuffer } from './RSA-include/rsa_keygen';

const { TextArea } = Input;
const { Option } = Select;

const { Title } = Typography;

class RSA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: null,
      keyType: null,
      inputText: null,
      outputText: null,
      keys: [],
      readableKeys: []
    }

    this.encryptInput = this.encryptInput.bind(this);
    this.decryptInput = this.decryptInput.bind(this);
    this.onChangeKey = this.onChangeKey.bind(this);
    this.onChangeKeyType = this.onChangeKeyType.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.checkInputs = this.checkInputs.bind(this); 
    this.generateKeyPair = this.generateKeyPair.bind(this);
  }

  render() {
    return (
      <>
        <Title>Rivest–Shamir–Adleman</Title>
        <Row gutter={[0, 24]}>
          <Col className="gutter-row" span={12}>
            <Title level={4}>RSA Key</Title>
            <select onChange={this.onChangeKey}>
              {this.state.keys.map((keyPair, i) => {
                return (
                  <option value={keyPair}>Client {i}</option>
                )
              })}
            </select>
          </Col>
          <Col className="gutter-row" span={12}>
            <Title level={4}>Key Type</Title>
            <Radio.Group onChange={this.onChangeKeyType}>
              <Radio value={1}>Private</Radio>
              <Radio value={2}>Public</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row  gutter={[24, 24]}>
          <Col className="gutter-row" span={12}>
            <Title level={2}>Text to be converted</Title>
            <TextArea onChange={this.onChangeInput} defaultValue="" value={this.state.inputText} placeholder="Please paste the text to be converted here..." autoSize></TextArea>
          </Col>
          <Col className="gutter-row" span={12}>
            <Title level={2}>Output</Title>
            <TextArea defaultValue="" value={this.state.outputText} placeholder="Output goes here..." readOnly autoSize></TextArea>
          </Col>
        </Row>
        <Row justify="space-around" gutter={[24, 24]}>
          <Col className="gutter-row" span={12}>
            <Button onClick={this.encryptInput} type="primary" danger block>Encrypt</Button>
          </Col>
          <Col className="gutter-row" span={12}>
            <Button onClick={this.decryptInput} type="primary" block>Decrypt</Button>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col style={{textAlign: "center"}} className="gutter-row" span={24}>
            <Button onClick={this.generateKeyPair}>Generate Key Pair</Button>
            <Title level={4}>Generated Key Pairs</Title>
            {this.state.readableKeys.map((keyPair, i) => {
              return (
                <Row justify="space-around" gutter={[24, 24]}>
                  <Col span={12}><TextArea rows={4} value={keyPair.privateKey}></TextArea></Col>
                  <Col span={12}><TextArea rows={4} value={keyPair.publicKey}></TextArea></Col>
                </Row>
              )
            })}
          </Col>
        </Row>
      </>
    );
  }

  onChangeKey(value) {
    alert("changekey");
    this.setState({ key: value });
  }

  onChangeKeyType(e) {
    this.setState({ keyType: e.target.value });
  }

  onChangeInput(e) {
    this.setState({ inputText: e.target.value });
  }

  checkInputs() {
    if(this.state && this.state.key && this.state.keyType && this.state.inputText){
      return true;
    }else{ return false; }
  }

  async generateKeyPair() {
    generateKey(2048).then((keyPair) => {
      exportPrivateKey(keyPair.privateKey).then((exported) => {
        let privTemp = toPem(exported, 'PRIVATE');
        exportPublicKey(keyPair.publicKey).then((exported) => {
          let pubTemp = toPem(exported, 'PUBLIC');
          if(!this.state.key) {
            this.setState({key: keyPair});
          }
          this.setState({
            keys: [...this.state.keys, keyPair],
            readableKeys: [
              ...this.state.readableKeys,
              {
                privateKey: privTemp,
                publicKey: pubTemp
              }
            ]
          });
        });
      });
    });
  }

  encryptInput() {
    if(!this.checkInputs()) return;
    let encrypted;
    if(this.state.keyType === 1) {
      encrypted = encrypt(this.state.inputText, this.state.key.privateKey);
    }else if(this.state.keyType === 2) {
      encrypted = encrypt(this.state.inputText, this.state.key.publicKey);
    }
    encrypted.then((ciphertext) => {
        this.setState({ outputText: arrayBufferToBase64(ciphertext) });
      }).catch((err) => {
        alert("Encrypt: "+err)
      });
  }

  async decryptInput() {
    if(!this.checkInputs()) return;
    let decrypted;
    if(this.state.keyType === 1) {
      decrypted = decrypt(base64ToArrayBuffer(this.state.inputText), this.state.key.privateKey);
    }else if(this.state.keyType === 2) {
      decrypted = decrypt(base64ToArrayBuffer(this.state.inputText), this.state.key.publicKey);
    }
    let plaintext = await decrypted
      .catch((err) => {
        alert("decrypt: "+err)
      });
    this.setState({ outputText: plaintext });
  }
}

export default RSA;
