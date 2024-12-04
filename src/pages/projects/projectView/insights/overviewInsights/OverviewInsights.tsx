import { Button, Card, Flex, Tooltip, Typography } from 'antd';
import React from 'react';
import checkIcon from '../../../../../assets/icons/insightsIcons/insights-check.png';
import clipboardIcon from '../../../../../assets/icons/insightsIcons/clipboard.png';
import warningIcon from '../../../../../assets/icons/insightsIcons/warning.png';
import clockIcon from '../../../../../assets/icons/insightsIcons/clock-green.png';
import StatusGraph from './graphs/StatusGraph';
import PriorityGraph from './graphs/PriorityGraph';
import InsightStatCard from '../InsightStatCard';
import LastUpdatedTable from './tables/LastUpdatedTable';
import { colors } from '../../../../../styles/colors';
import ProjectDeadlineTable from './tables/ProjectDeadlineTable';

const OverviewInsights = () => {
  return (
    <Flex vertical gap={24}>
      <Flex
        gap={24}
        className="grid sm:grid-cols-2 sm:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1"
      >
        <InsightStatCard
          icon={checkIcon}
          title="Completed tasks"
          children={6}
        />
        <InsightStatCard
          icon={clipboardIcon}
          title="Incomplete tasks"
          children={14}
        />
        <InsightStatCard
          icon={warningIcon}
          title="Overdue tasks"
          tooltip={'Tasks that are past their due date'}
          children={5}
        />
        <InsightStatCard
          icon={clockIcon}
          title="Under logged hours"
          tooltip={
            'Difference between task estimation and logged time for tasks.'
          }
          children={
            <Tooltip
              title={
                <table>
                  <tr style={{ display: 'flex', gap: 12 }}>
                    <td style={{ width: 120 }}>Total estimation</td>
                    <td>20h 30m</td>
                  </tr>
                  <tr style={{ display: 'flex', gap: 12 }}>
                    <td style={{ width: 120 }}>Total logged</td>
                    <td>4h 30m</td>
                  </tr>
                  <tr style={{ display: 'flex', gap: 12 }}>
                    <td style={{ width: 120 }}>Hours</td>
                    <td>16h</td>
                  </tr>
                </table>
              }
              trigger={'hover'}
            >
              4h 30m
            </Tooltip>
          }
        />
      </Flex>

      <Flex gap={24} className="grid md:grid-cols-2">
        <Card
          className="custom-insights-card"
          title={
            <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
              Status Overview
            </Typography.Text>
          }
          style={{ width: '100%' }}
        >
          <StatusGraph />
        </Card>
        <Card
          className="custom-insights-card"
          title={
            <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
              Priority Overview
            </Typography.Text>
          }
          style={{ width: '100%' }}
        >
          <PriorityGraph />
        </Card>
      </Flex>

      <Flex gap={24} className="grid lg:grid-cols-2">
        <Card
          className="custom-insights-card"
          title={
            <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
              Last Updated Tasks
            </Typography.Text>
          }
          extra={<Button type="link">See all</Button>}
          style={{ width: '100%' }}
        >
          <LastUpdatedTable />
        </Card>

        <Card
          className="custom-insights-card"
          title={
            <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
              Project Deadline{' '}
              <span style={{ color: colors.lightGray }}>(2024-11-15)</span>
            </Typography.Text>
          }
          style={{ width: '100%' }}
        >
          <Flex vertical gap={24}>
            <Flex gap={12} style={{ width: '100%' }}>
              <InsightStatCard
                icon={warningIcon}
                title="Overdue tasks (hours)"
                tooltip={
                  'Tasks that has time logged past the end date of the project'
                }
                children={'1m 54s'}
              />
              <InsightStatCard
                icon={warningIcon}
                title="Overdue tasks"
                tooltip={'Tasks that are past the end date of the project'}
                children={4}
              />
            </Flex>

            <ProjectDeadlineTable />
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default OverviewInsights;
