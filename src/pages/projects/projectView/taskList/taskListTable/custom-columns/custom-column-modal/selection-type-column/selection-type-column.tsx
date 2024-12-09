import { CloseCircleOutlined, HolderOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Select, Tag, Typography } from 'antd';
import React from 'react';
import { PhaseColorCodes } from '../../../../../../../../shared/constants';

const SelectionTypeColumn = () => {
  // phase options color options
  const phaseOptionColorList = [
    ...PhaseColorCodes.map((color, index) => ({
      key: index,
      value: color,
      label: (
        <Tag
          color={color}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 15,
            height: 15,
            borderRadius: '50%',
          }}
        />
      ),
    })),
  ];

  return (
    <Form.Item
      name={'options'}
      label={<Typography.Text>Options</Typography.Text>}
    >
      <Flex vertical gap={8}>
        <Flex gap={8} align="center">
          <HolderOutlined style={{ fontSize: 18 }} />
          <Input
            value={'Untitled selection'}
            style={{ width: 'fit-content', maxWidth: 400 }}
          />

          <Flex>
            <Select
              variant="borderless"
              suffixIcon={null}
              options={phaseOptionColorList}
              defaultValue={phaseOptionColorList[0]}
              style={{
                width: 48,
              }}
            />
            <CloseCircleOutlined />
          </Flex>
        </Flex>
        <Button type="link" style={{ width: 'fit-content', padding: 0 }}>
          + Add an option
        </Button>
      </Flex>
    </Form.Item>
  );
};

export default SelectionTypeColumn;
