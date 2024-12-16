import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Badge, Card, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, Tooltip);

const OverviewReportsProjectCategoryGraph = () => {
  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  type CategoryGraphItemType = {
    name: string;
    color: string;
    count: number;
  };

  // mock data
  const categoryGraphItems: CategoryGraphItemType[] = [
    { name: 'New', color: '#80ca79', count: 20 },
    { name: 'Hello', color: '#f37070', count: 15 },
  ];

  // chart data
  const chartData = {
    labels: categoryGraphItems.map((item) => t(`${item.name}Text`)),
    datasets: [
      {
        label: t('projectsText'),
        data: categoryGraphItems.map((item) => item.count),
        backgroundColor: categoryGraphItems.map((item) => item.color),
      },
    ],
  };

  const totalTasks = categoryGraphItems.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
          {t('projectsByCategoryText')}
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

          {/* category-specific tasks */}
          {categoryGraphItems.map((item) => (
            <Flex key={item.name} gap={4} align="center">
              <Badge color={item.color} />
              <Typography.Text ellipsis>
                {item.name} ({item.count})
              </Typography.Text>
            </Flex>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OverviewReportsProjectCategoryGraph;
