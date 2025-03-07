import { Typography } from 'antd';
import React from 'react';

type ProjectUpdateCellProps = {
  updates: { comment: string }[];
};

const ProjectUpdateCell = ({ updates }: ProjectUpdateCellProps) => {
  return (
    <Typography.Text
      style={{ cursor: 'pointer' }}
      ellipsis={{ expanded: false }}
      className="group-hover:text-[#1890ff]"
    >
      {updates[0] ? updates[0]?.comment : '-'}
    </Typography.Text>
  );
};

export default ProjectUpdateCell;
