import { Empty, Typography } from 'antd';
import React from 'react';
import emptyImg from '../assets/images/empty-box.webp';

type EmptyListPlaceholderProps = {
  imageHeight?: number;
  text: string;
};

const EmptyListPlaceholder = ({
  imageHeight = 60,
  text,
}: EmptyListPlaceholderProps) => {
  return (
    <Empty
      image={emptyImg}
      imageStyle={{ height: imageHeight }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBlockStart: 24,
      }}
      description={<Typography.Text type="secondary">{text}</Typography.Text>}
    />
  );
};

export default EmptyListPlaceholder;
