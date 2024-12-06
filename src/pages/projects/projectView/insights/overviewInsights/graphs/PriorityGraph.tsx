import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Flex } from 'antd';

Chart.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement);

const PriorityGraph = () => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Priority',
          align: 'end',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.5)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Task Count',
          align: 'end',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.5)',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      datalabels: {
        display: false
      },
    },
  };

  //   priority mock data
  const mockPriorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks',
        data: [6, 12, 2],
        backgroundColor: ['#75c997', '#fbc84c', '#f37070'],
        hoverBackgroundColor: ['#46d980', '#ffc227', '#ff4141'],
      },
    ],
  };

  return (
    <Flex justify="center">
      <Bar
        options={options}
        data={mockPriorityData}
        className="h-[350px] w-full md:max-w-[580px]"
      />
    </Flex>
  );
};

export default PriorityGraph;
