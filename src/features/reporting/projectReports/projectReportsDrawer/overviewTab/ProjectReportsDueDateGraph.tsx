import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Badge, Card, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip);

const ProjectReportsDueDateGraph = () => {
  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  type DueDateGraphItemType = {
    name: string;
    color: string;
    count: number;
  };

  // mock data
  const dueDateGraphItems: DueDateGraphItemType[] = [
    { name: 'completed', color: '#75c997', count: 6 },
    { name: 'upcoming', color: '#70a6f3', count: 8 },
    { name: 'overdue', color: '#f37070', count: 2 },
    { name: 'noDueDate', color: '#a9a9a9', count: 4 },
  ];

  // chart data
  const chartData = {
    labels: dueDateGraphItems.map((item) => t(`${item.name}Text`)),
    datasets: [
      {
        label: t('tasksText'),
        data: dueDateGraphItems.map((item) => item.count),
        backgroundColor: dueDateGraphItems.map((item) => item.color),
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
        display: false
      },
    },
  }

  const totalTasks = dueDateGraphItems.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
          {t('tasksByDueDateText')}
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

          {/* due Date-specific tasks */}
          {dueDateGraphItems.map((item) => (
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

export default ProjectReportsDueDateGraph;
