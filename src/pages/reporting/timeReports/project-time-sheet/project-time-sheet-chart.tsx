import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsonData from './projects-time-sheet.json';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import {
  setSelectedLabel,
  toggleTimeLogDrawer,
} from '../../../../features/timeReport/projects/timeLogSlice';
import ProjectTimeLogDrawer from '../../../../features/timeReport/projects/ProjectTimeLogDrawer';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const ProjectTimeSheetChart: React.FC = () => {
  const labels = jsonData.map(item => item.name);
  const dataValues = jsonData.map(item => {
    const loggedTimeInHours = parseFloat(item.logged_time) / 3600;
    return loggedTimeInHours.toFixed(2);
  });
  const colors = jsonData.map(item => item.color_code);

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('time-report');

  const handleBarClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index; // Get the index of the clicked bar
      const label = labels[elementIndex]; // Get the label of the clicked bar
      dispatch(setSelectedLabel(label)); // Set the selected label
      dispatch(toggleTimeLogDrawer()); // Open the drawer
    }
  };

  // Chart data
  const data = {
    labels,
    datasets: [
      {
        label: t('loggedTime'),
        data: dataValues,
        backgroundColor: colors,
        barThickness: 40,
      },
    ],
  };

  // Chart options
  const options = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: 'white',
        anchor: 'start' as const,
        align: 'right' as const,
        offset: 20,
        textStrokeColor: 'black',
        textStrokeWidth: 4,
      },
      legend: {
        display: false,
        position: 'top' as const,
      },
    },
    backgroundColor: 'black',
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: t('loggedTime'),
          align: 'end' as const,
          font: {
            family: 'Helvetica',
          },
        },
        grid: {
          color: themeMode === 'dark' ? '#2c2f38' : '#e5e5e5',
          lineWidth: 1,
        },
      },
      y: {
        title: {
          display: true,
          text: t('projects'),
          align: 'end' as const,
          font: {
            family: 'Helvetica',
          },
        },
        grid: {
          color: themeMode === 'dark' ? '#2c2f38' : '#e5e5e5',
          lineWidth: 1,
        },
      },
    },
    onClick: handleBarClick,
  };

  return (
    <div>
      <div
        style={{
          maxWidth: 'calc(100vw - 220px)',
          minWidth: 'calc(100vw - 260px)',
          minHeight: 'calc(100vh - 300px)',
          height: `${60 * data.labels.length}px`,
        }}
      >
        <Bar data={data} options={options} />
        <ProjectTimeLogDrawer />
      </div>
    </div>
  );
};

export default ProjectTimeSheetChart;
