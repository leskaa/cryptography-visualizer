import React, { useState } from 'react';
import { PageHeader, Select } from 'antd';
import AES from '../components/AES';
import RSA from '../components/RSA/RSA';
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
              <Option value="AES">AES</Option>
            </OptGroup>
            <OptGroup label="Asymmetric">
              <Option value="RSA">RSA</Option>
              <Option value="ECC">ECC</Option>
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
