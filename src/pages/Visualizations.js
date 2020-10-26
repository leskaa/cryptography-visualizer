import React, { useState } from 'react';
import { PageHeader, Select } from 'antd';
import AES from '../components/AES';
import RSA from '../components/RSA';
import ECC from '../components/ECC';

const { Option, OptGroup } = Select;

export const Visualizations = () => {
  const [algorithm, setAlgorithm] = useState('Select Algorithm');

  function handleChange(value) {
    setAlgorithm(value);
  }

  return (
    <div>
      <PageHeader
        className="page-header"
        title="Visualizations"
        subTitle="Explore cryptography algorithms"
        extra={[
          <Select
            defaultValue="Select Algorithm"
            style={{ width: 200 }}
            onChange={handleChange}
          >
            <OptGroup label="Symmetric">
              <Option value="AES">Advanced Encryption Standard</Option>
            </OptGroup>
            <OptGroup label="Asymmetric">
              <Option value="RSA">Rivest–Shamir–Adleman</Option>
              <Option value="ECC">Elliptic-Curve Cryptography</Option>
            </OptGroup>
          </Select>
        ]}
      />
      {
        {
          AES: <AES />,
          RSA: <RSA />,
          ECC: <ECC />
        }[algorithm]
      }
    </div>
  );
};

export default Visualizations;
