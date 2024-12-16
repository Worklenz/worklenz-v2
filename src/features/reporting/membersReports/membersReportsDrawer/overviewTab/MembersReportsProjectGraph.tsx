import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Badge, Card, Flex, Typography, Tooltip as AntTooltip } from 'antd';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip);

const MembersReportsProjectGraph = () => {
  // localization
  const { t } = useTranslation('reporting-members-drawer');

  type ProjectGraphItemsType = {
    name: string;
    color: string;
    count: number;
  };

  // mock data
  const projectGraphItems: ProjectGraphItemsType[] = [
    {
      name: 'Demo Project',
      color: '#3b7ad4',
      count: 6,
    },
    {
      name: 'Android task monitoring',
      color: '#70a6f3',
      count: 8,
    },
    {
      name: 'Legal',
      color: '#3b7ad4',
      count: 2,
    },
    {
      name: 'Bug tracker',
      color: '#bf4949',
      count: 4,
    },
  ];

  // chart data
  const chartData = {
    labels: projectGraphItems.map((item) => item.name),
    datasets: [
      {
        label: t('tasksText'),
        data: projectGraphItems.map((item) => item.count),
        backgroundColor: projectGraphItems.map((item) => item.color),
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

  const totalTasks = projectGraphItems.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
          {t('tasksByProjectsText')}
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

          {/* project-specific tasks */}
          {projectGraphItems.map((item) => (
            <AntTooltip title={`${item.name} (${item.count})`}>
              <Flex
                key={item.name}
                gap={4}
                align="center"
                style={{ maxWidth: 120 }}
              >
                <Badge color={item.color} />
                <Typography.Text ellipsis>{item.name}</Typography.Text>(
                {item.count})
              </Flex>
            </AntTooltip>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MembersReportsProjectGraph;