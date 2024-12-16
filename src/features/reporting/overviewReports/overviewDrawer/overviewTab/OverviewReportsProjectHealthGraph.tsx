import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Badge, Card, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip);

const OverviewReportsProjectHealthGraph = () => {
  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  type HealthGraphItemType = {
    name: string;
    color: string;
    count: number;
  };

  // mock data
  const healthGraphItems: HealthGraphItemType[] = [
    { name: 'notSet', color: '#a9a9a9', count: 2 },
    { name: 'needsAttention', color: '#f37070', count: 1 },
    { name: 'atRisk', color: '#fbc84c', count: 0 },
    { name: 'good', color: '#75c997', count: 1 },
  ];

  // chart data
  const chartData = {
    labels: healthGraphItems.map((item) => t(`${item.name}Text`)),
    datasets: [
      {
        label: t('projectsText'),
        data: healthGraphItems.map((item) => item.count),
        backgroundColor: healthGraphItems.map((item) => item.color),
      },
    ],
  };

  const totalTasks = healthGraphItems.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
          {t('projectsByHealthText')}
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

          {/* health-specific tasks */}
          {healthGraphItems.map((item) => (
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

export default OverviewReportsProjectHealthGraph;
