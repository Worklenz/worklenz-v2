import { Typography } from 'antd';
import React from 'react';

const DescriptionCell = ({ description }: { description: string }) => {
  return (
    <Typography.Paragraph
      ellipsis={{ expandable: false }}
      style={{ width: 260, marginBlockEnd: 0 }}
    >
      {description}
    </Typography.Paragraph>
  );
};

export default DescriptionCell;
