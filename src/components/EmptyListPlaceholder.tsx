import { Empty, Typography } from 'antd';
import React from 'react';

type EmptyListPlaceholderProps = {
  imageSrc: string;
  imageHeight?: number;
  text: string;
};

const EmptyListPlaceholder = ({
  imageSrc,
  imageHeight,
  text,
}: EmptyListPlaceholderProps) => {
  return (
    <Empty
      image={imageSrc}
      imageStyle={{ height: imageHeight || 60 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBlockStart: 24,
      }}
      description={<Typography.Text>{text}</Typography.Text>}
    />
  );
};

export default EmptyListPlaceholder;
