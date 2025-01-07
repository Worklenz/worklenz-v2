import React, { ReactNode } from 'react';
import { Card, Flex, Typography } from 'antd';

type InsightCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

const OverviewStatCard = ({ icon, title, children }: InsightCardProps) => {
  return (
    <Card
      className="custom-insights-card"
      style={{ width: '100%' }}
      styles={{ body: { paddingInline: 16, paddingBlock: 8 } }}
    >
      <Flex gap={16} align="center">
        {icon}

        <Flex vertical>
          <Typography.Text style={{ fontSize: 22 }}>{title}</Typography.Text>

          <>{children}</>
        </Flex>
      </Flex>
    </Card>
  );
};

export default OverviewStatCard;
