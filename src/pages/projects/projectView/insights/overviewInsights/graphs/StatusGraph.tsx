import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement,} from 'chart.js';
import { Badge, Flex, Tooltip, Typography } from 'antd';
import { ChartOptions } from 'chart.js';

Chart.register(ArcElement);

const StatusGraph = () => {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
  };

  //   mock task data
  const mockStatusData = {
    labels: ['To Do', 'Doing', 'Done'],
    datasets: [
      {
        label: 'Tasks',
        data: [10, 4, 6],
        backgroundColor: ['#a9a9a9', '#70a6f3', '#75c997'],
        hoverBackgroundColor: ['#989898', '#4190ff', '#46d980'],
      },
    ],
  };

  return (
    <Flex gap={24} wrap="wrap-reverse" justify="center">
      <Doughnut
        options={options}
        data={mockStatusData}
        className="max-h-[350px] w-full max-w-[350px]"
      />

      <Flex
        gap={12}
        style={{ marginBlockStart: 12 }}
        wrap={'wrap'}
        className="flex-row xl:flex-col"
      >
        <Flex gap={8} align="center">
          <Badge color={'#a9a9a9'} />
          <Tooltip title='To Do'>
            <Typography.Text>To Do (7) </Typography.Text>
          </Tooltip>
        </Flex>
        <Flex gap={8} align="center">
          <Badge color={'#70a6f3'} />
          <Tooltip title='Doing'>
            <Typography.Text>Doing (2) </Typography.Text>
          </Tooltip>
        </Flex>
        <Flex gap={8} align="center">
          <Badge color={'#75c997'} />
          <Tooltip title='Done'>
            <Typography.Text>Done (6) </Typography.Text>
          </Tooltip>
        </Flex>
        <Flex gap={8} align="center">
          <Badge color={'#a9a9a9'} />
          <Tooltip title='On Hold'>
            <Typography.Text>On Hold (3) </Typography.Text>
          </Tooltip>
        </Flex>
        <Flex gap={8} align="center">
          <Badge color={'#70a6f3'} />
          <Tooltip title='In Review'>
            <Typography.Text>In Review (2) </Typography.Text>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StatusGraph;
