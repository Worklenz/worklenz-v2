import { Form, Typography } from 'antd';
import React from 'react';

const UnformattedTypeNumberColumn = () => {
  const previewValue = 1000;

  return (
    <Form.Item
      name={'preview'}
      label={<Typography.Text>Preview</Typography.Text>}
    >
      {previewValue}
    </Form.Item>
  );
};

export default UnformattedTypeNumberColumn;
