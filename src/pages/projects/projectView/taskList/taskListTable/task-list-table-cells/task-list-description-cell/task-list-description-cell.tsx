import { Typography } from 'antd';
import React from 'react';
import DOMPurify from 'dompurify';

const TaskListDescriptionCell = ({ description }: { description: string }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);
  return (
    <Typography.Paragraph
      ellipsis={{ expandable: false }}
      style={{ width: 260, marginBlockEnd: 0 }}
    >
      {/* {sanitizedDescription} */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sanitizedDescription || '') }} />
    </Typography.Paragraph>
  );
};

export default TaskListDescriptionCell;
