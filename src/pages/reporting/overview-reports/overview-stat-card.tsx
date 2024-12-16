import { ReactNode } from 'react';
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
      styles={{ body: { paddingInline: 16 } }}
    >
      <Flex gap={16} align="flex-start">
        {icon}

        <Flex vertical gap={12}>
          <Typography.Text style={{ fontSize: 16 }}>{title}</Typography.Text>

          <>{children}</>
        </Flex>
      </Flex>
    </Card>
  );
};

export default OverviewStatCard;
