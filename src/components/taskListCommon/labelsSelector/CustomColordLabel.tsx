import React from 'react';
import { LabelType } from '../../../types/label.type';
import { Tag, Tooltip } from 'antd';

const CustomColordLabel = ({ label }: { label: LabelType | null }) => {
  return (
    <Tooltip title={label?.labelName}>
      <Tag
        key={label?.labelId}
        color={label?.labelColor}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          height: 18,
          width: 'fit-content',
          fontSize: 11,
        }}
      >
        {label?.labelName}
      </Tag>
    </Tooltip>
  );
};

export default CustomColordLabel;
