import { Form, Select, Typography } from 'antd';
import React, { useState } from 'react';
import { themeWiseColor } from '../../../../../../../../utils/themeWiseColor';
import { useAppSelector } from '../../../../../../../../hooks/useAppSelector';

type ExpressionType = 'add' | 'substract' | 'divide' | 'multiply';

const FormulaTypeColumn = () => {
  const [expression, setExpression] = useState<ExpressionType>('add');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const expressionTypesOptions = [
    {
      key: 'add',
      value: 'add',
      label: '+ Add',
    },
    {
      key: 'substract',
      value: 'substract',
      label: '- Substract',
    },
    {
      key: 'divide',
      value: 'divide',
      label: '/ Divide',
    },
    {
      key: 'multiply',
      value: 'multiply',
      label: 'x Multiply',
    },
  ];

  const columnsOptions = [
    {
      key: 1,
      value: 1,
      label: 'New Field 1',
    },
    {
      key: 2,
      value: 2,
      label: 'New Field 2',
    },
    {
      key: 3,
      value: 3,
      label: 'New Field 3',
    },
  ];

  return (
    <Form.Item
      name={'expressions'}
      label={<Typography.Text>Expressions</Typography.Text>}
    >
      <div className="grid grid-cols-3 gap-4">
        <Select
          options={columnsOptions}
          placeholder="Select input"
          style={{
            minWidth: '100%',
            width: 150,
            border: `1px solid ${themeWiseColor('#d9d9d9', '#424242', themeMode)}`,
            borderRadius: 4,
          }}
        />

        <Select
          options={expressionTypesOptions}
          value={expression}
          onChange={(value) => setExpression(value)}
          style={{
            minWidth: '100%',
            width: 150,
            border: `1px solid ${themeWiseColor('#d9d9d9', '#424242', themeMode)}`,
            borderRadius: 4,
          }}
        />

        <Select
          options={columnsOptions}
          placeholder="Select input"
          style={{
            minWidth: '100%',
            width: 150,
            border: `1px solid ${themeWiseColor('#d9d9d9', '#424242', themeMode)}`,
            borderRadius: 4,
          }}
        />
      </div>
    </Form.Item>
  );
};

export default FormulaTypeColumn;
