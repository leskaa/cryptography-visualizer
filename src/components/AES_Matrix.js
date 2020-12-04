import React, { Component } from 'react';
import { Table } from 'antd';

class AES_Matrix extends Component {
  dataSource = [
    {
      key: 'r1',
      c1: this.props.value.col1[0],
      c2: this.props.value.col2[0],
      c3: this.props.value.col3[0],
      c4: this.props.value.col4[0]
    },
    {
      key: 'r2',
      c1: this.props.value.col1[1],
      c2: this.props.value.col2[1],
      c3: this.props.value.col3[1],
      c4: this.props.value.col4[1]
    },
    {
      key: 'r3',
      c1: this.props.value.col1[2],
      c2: this.props.value.col2[2],
      c3: this.props.value.col3[2],
      c4: this.props.value.col4[2]
    },
    {
      key: 'r4',
      c1: this.props.value.col1[3],
      c2: this.props.value.col2[3],
      c3: this.props.value.col3[3],
      c4: this.props.value.col4[3]
    }
  ];
  columns = [
    {
      dataIndex: 'c1'
    },
    {
      dataIndex: 'c2'
    },
    {
      dataIndex: 'c3'
    },
    {
      dataIndex: 'c4'
    }
  ];

  render() {
    return (
      <div>
        <Table dataSource={this.dataSource} columns={this.columns} />
      </div>
    );
  }
}

export default AES_Matrix;
