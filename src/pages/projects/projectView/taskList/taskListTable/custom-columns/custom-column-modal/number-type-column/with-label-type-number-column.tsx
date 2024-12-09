import { Form, Input, Select, Typography } from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../../../../../hooks/useAppSelector';
import { themeWiseColor } from '../../../../../../../../utils/themeWiseColor';

const WithLabelTypeNumberColumn = () => {
  const [labelValue, setLabelValue] = useState<string>('LKR');
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [decimal, setDecimal] = useState<number>(0);
  const previewValue = 1000;

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  return (
    <>
      <Form.Item
        name={'label'}
        label={<Typography.Text>Label</Typography.Text>}
      >
        <Input
          value={'LKR'}
          onChange={(e) => setLabelValue(e.currentTarget.value)}
        />
      </Form.Item>

      <Form.Item
        name={'position'}
        label={<Typography.Text>Position</Typography.Text>}
      >
        <Select
          options={[
            {
              key: 'left',
              value: 'left',
              label: 'Left',
            },
            { key: 'right', value: 'right', label: 'Right' },
          ]}
          defaultValue={position}
          value={position}
          onChange={(value) => setPosition(value)}
          style={{
            border: `1px solid ${themeWiseColor('#d9d9d9', '#424242', themeMode)}`,
            borderRadius: 4,
          }}
        />
      </Form.Item>

      <Form.Item
        name={'decimals'}
        label={<Typography.Text>Decimals</Typography.Text>}
      >
        <Select
          options={[1, 2, 3, 4].map((item) => ({
            key: item,
            value: item,
            label: item,
          }))}
          value={decimal}
          onChange={(value) => setDecimal(value)}
          style={{
            border: `1px solid ${themeWiseColor('#d9d9d9', '#424242', themeMode)}`,
            borderRadius: 4,
          }}
        />
      </Form.Item>

      <Form.Item
        name={'preview'}
        label={<Typography.Text>Preview</Typography.Text>}
        className="col-span-5"
      >
        <Typography.Text>
          {position === 'left'
            ? `${labelValue} ${previewValue.toFixed(decimal)}`
            : `${previewValue.toFixed(decimal)} ${labelValue} `}
        </Typography.Text>
      </Form.Item>
    </>
  );
};

export default WithLabelTypeNumberColumn;
