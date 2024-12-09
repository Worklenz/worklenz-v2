import { Form, Select, Typography } from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../../../../../hooks/useAppSelector';
import { themeWiseColor } from '../../../../../../../../utils/themeWiseColor';

const FormattedTypeNumberColumn = () => {
  const [decimal, setDecimal] = useState<number>(0);
  const previewValue = 1000;

  // Get theme details from the theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <>
      <Form.Item
        name="decimals"
        label={<Typography.Text>Decimals</Typography.Text>}
      >
        <Select
          options={[1, 2, 3, 4].map((item) => ({
            key: item,
            value: item,
            label: item,
          }))}
          defaultValue={decimal}
          onChange={(value) => setDecimal(value)}
          style={{
            border: `1px solid ${themeWiseColor('#d9d9d9', '#424242', themeMode)}`,
            borderRadius: 4,
          }}
        />
      </Form.Item>

      <Form.Item
        name="preview"
        label={<Typography.Text>Preview</Typography.Text>}
      >
        <Typography.Text>{previewValue.toFixed(decimal)}</Typography.Text>
      </Form.Item>
    </>
  );
};

export default FormattedTypeNumberColumn;
