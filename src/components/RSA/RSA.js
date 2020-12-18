import React, { Component } from 'react';
import { Typography, Input, Button, Row, Col, Radio, Select, Slider } from 'antd';
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
      readableKeys: [],
      sliderValue: 50,
      keyMaxMsgSize: []
    }

    this.encryptInput = this.encryptInput.bind(this);
    this.decryptInput = this.decryptInput.bind(this);
    this.onChangeKey = this.onChangeKey.bind(this);
    this.onChangeKeyType = this.onChangeKeyType.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.checkInputs = this.checkInputs.bind(this); 
    this.generateKeyPair = this.generateKeyPair.bind(this);
    this.onChangeSlider = this.onChangeSlider.bind(this);
    this.sliderValConverter = this.sliderValConverter.bind(this);
    this.getMaxMsgSize = this.getMaxMsgSize.bind(this);
  }

  render() {
    const marks = {
      0: '1024 bits',
      50: '2048 bits',
      100: '4096 bits'
    };

    return (
      <>
        <Title>Rivest–Shamir–Adleman</Title>
        <Row justify="center" gutter={[0, 24]}>
          <Col className="gutter-row" span={8}>
            <Title level={4}>RSA Key</Title>
            <Select onChange={this.onChangeKey} value={this.state.key} style={{width: "100%"}}>
              {this.state.keys.map((keyPair, i) => {
                return (
                  <Option value={i}>RSA Key Pair #{i + 1}</Option>
                )
              })}
            </Select>
          </Col>
        </Row>
        <Row  gutter={[24, 24]}>
          <Col className="gutter-row" span={12}>
            <Title level={2}>Text to be converted - Max Length: {this.state.keyMaxMsgSize[this.state.key]} chars</Title>
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
            <Row justify="center">
              <Col>
                <Button onClick={this.generateKeyPair}>Generate Key Pair</Button>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={8}>
                <Slider onChange={this.onChangeSlider} defaultValue={50} marks={marks} step={null} min={0} max={100} tooltipVisible={false}></Slider>
              </Col>
            </Row>
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

  onChangeSlider(value) {
    this.setState({sliderValue: value});
  }

  onChangeKey(value) {
    //this.setState({ key: e.target.value });
    this.setState({ key: value });
  }

  onChangeKeyType(e) {
    this.setState({ keyType: e.target.value });
  }

  onChangeInput(e) {
    this.setState({ inputText: e.target.value });
  }

  checkInputs() {
    if(this.state != null && this.state.key != null && this.state.inputText != null){
      return true;
    }else{ return false; }
  }

  sliderValConverter(val) {
    let realVal;
    switch (val) {
      case 0: //256
        realVal = 1024;
        break;
      case 50: //2048
        realVal = 2048;
        break;
      case 100: //4096
        realVal = 4096;
        break;
      default:
        break;
    }
    return realVal;
  }

  getMaxMsgSize(val) {
    let realVal;
    switch (val) {
      case 1024: //256
        realVal = 62;
        break;
      case 2048: //2048
        realVal = 190;
        break;
      case 4096: //4096
        realVal = 446;
        break;
      default:
        break;
    }
    return realVal;
  }

  async generateKeyPair() {
    generateKey(this.sliderValConverter(this.state.sliderValue)).then((keyPair) => {
      exportPrivateKey(keyPair.privateKey).then((exported) => {
        let privTemp = toPem(exported, 'PRIVATE');
        exportPublicKey(keyPair.publicKey).then((exported) => {
          let pubTemp = toPem(exported, 'PUBLIC');
          if(!this.state.key) {
            this.setState({key: 0});
          }
          this.setState({
            keys: [...this.state.keys, keyPair],
            keyMaxMsgSize: [...this.state.keyMaxMsgSize, this.getMaxMsgSize(this.sliderValConverter(this.state.sliderValue))],
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
    if(!this.checkInputs() || this.state.inputText.length > this.state.keyMaxMsgSize[this.state.key]) return;
    encrypt(this.state.inputText, this.state.keys[this.state.key].publicKey)
      .then((ciphertext) => {
        this.setState({ outputText: arrayBufferToBase64(ciphertext) });
      }).catch((err) => {
        alert("Encrypt Error: "+err)
      });
  }

  decryptInput() {
    if(!this.checkInputs()) return;
    decrypt(base64ToArrayBuffer(this.state.inputText), this.state.keys[this.state.key].privateKey)
      .then((plaintext) => {
        this.setState({ outputText: plaintext });
      })
      .catch((err) => {
        alert("decrypt: "+err)
      });
  }
}

export default RSA;
