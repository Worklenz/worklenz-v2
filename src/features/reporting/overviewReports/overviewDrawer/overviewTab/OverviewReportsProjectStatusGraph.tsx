import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Badge, Card, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip);

const OverviewReportsProjectStatusGraph = () => {
  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  type StatusGraphItemType = {
    name: string;
    color: string;
    count: number;
  };

  // mock data
  const statusGraphItems: StatusGraphItemType[] = [
    { name: 'inProgress', color: '#80ca79', count: 0 },
    { name: 'inPlanning', color: '#cbc8a1', count: 0 },
    { name: 'completed', color: '#80ca79', count: 1 },
    { name: 'proposed', color: '#cbc8a1', count: 43 },
    { name: 'onHold', color: '#cbc8a1', count: 1 },
    { name: 'blocked', color: '#cbc8a1', count: 0 },
    { name: 'cancelled', color: '#f37070', count: 0 },
  ];

  // chart data
  const chartData = {
    labels: statusGraphItems.map((item) => t(`${item.name}Text`)),
    datasets: [
      {
        label: t('projectsText'),
        data: statusGraphItems.map((item) => item.count),
        backgroundColor: statusGraphItems.map((item) => item.color),
      },
    ],
  };

  const totalTasks = statusGraphItems.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
          {t('projectsByStatusText')}
        </Typography.Text>
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-6 xl:flex-nowrap">
        <Doughnut
          data={chartData}
          options={{ responsive: true }}
          className="max-h-[200px] w-full max-w-[200px]"
        />

        <div className="flex flex-row flex-wrap gap-3 xl:flex-col">
          {/* total tasks */}
          <Flex gap={4} align="center">
            <Badge color="#a9a9a9" />
            <Typography.Text ellipsis>
              {t('allText')} ({totalTasks})
            </Typography.Text>
          </Flex>

          {/* status-specific tasks */}
          {statusGraphItems.map((item) => (
            <Flex key={item.name} gap={4} align="center">
              <Badge color={item.color} />
              <Typography.Text ellipsis>
                {t(`${item.name}Text`)} ({item.count})
              </Typography.Text>
            </Flex>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OverviewReportsProjectStatusGraph;
