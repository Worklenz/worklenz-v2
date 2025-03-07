import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Badge, Card, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip);

const MembersReportsStatusGraph = () => {
  // localization
  const { t } = useTranslation('reporting-members-drawer');

  type StatusGraphItemType = {
    name: string;
    color: string;
    count: number;
  };

  // mock data
  const statusGraphItems: StatusGraphItemType[] = [
    { name: 'todo', color: '#a9a9a9', count: 6 },
    { name: 'doing', color: '#70a6f3', count: 6 },
    { name: 'done', color: '#75c997', count: 8 },
  ];

  // chart data
  const chartData = {
    labels: statusGraphItems.map(item => t(`${item.name}Text`)),
    datasets: [
      {
        label: t('tasksText'),
        data: statusGraphItems.map(item => item.count),
        backgroundColor: statusGraphItems.map(item => item.color),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      datalabels: {
        display: false,
      },
    },
  };

  const totalTasks = statusGraphItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
          {t('tasksByStatusText')}
        </Typography.Text>
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-6 xl:flex-nowrap">
        <Doughnut
          data={chartData}
          options={options}
          className="max-h-[200px] w-full max-w-[200px]"
        />

        <div className="flex flex-row flex-wrap gap-3 xl:flex-col">
          {/* total tasks */}
          <Flex gap={4} align="center">
            <Badge color="#000" />
            <Typography.Text ellipsis>
              {t('allText')} ({totalTasks})
            </Typography.Text>
          </Flex>

          {/* status-specific tasks */}
          {statusGraphItems.map(item => (
            <Flex key={item.name} gap={4} align="center">
              <Badge color={item.color} />
              <Typography.Text ellipsis>
                {t(`${item.name}Text`)}({item.count})
              </Typography.Text>
            </Flex>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MembersReportsStatusGraph;
