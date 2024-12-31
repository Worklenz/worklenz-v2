import { Avatar, Checkbox, Flex, Input, Tooltip, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { financeTableColumns } from '../../../../../../lib/project/project-view-finance-table-columns';
import CustomAvatar from '../../../../../../components/CustomAvatar';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import {
  DollarCircleOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { toggleFinanceDrawer } from '../../../../../../features/finance/finance-slice';
import FinanceDrawer from '../../../../../../features/finance/finance-drawer.tsx/finance-drawer';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';

type FinanceTableProps = {
  table: any;
  isScrolling: boolean;
};

const FinanceTable = ({ table, isScrolling }: FinanceTableProps) => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // get theme data from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // totals of the current table
  const totals = useMemo(
    () => ({
      hours: (table?.tasks || []).reduce(
        (sum: any, task: { hours: any }) => sum + task.hours,
        0
      ),
      cost: (table?.tasks || []).reduce(
        (sum: any, task: { cost: any }) => sum + task.cost,
        0
      ),
      fixedCost: (table?.tasks || []).reduce(
        (sum: any, task: { fixedCost: any }) => sum + task.fixedCost,
        0
      ),
      totalBudget: (table?.tasks || []).reduce(
        (sum: any, task: { totalBudget: any }) => sum + task.totalBudget,
        0
      ),
      totalActual: (table?.tasks || []).reduce(
        (sum: any, task: { totalActual: any }) => sum + task.totalActual,
        0
      ),
      variance: (table?.tasks || []).reduce(
        (sum: any, task: { variance: any }) => sum + task.variance,
        0
      ),
    }),
    [table]
  );

  // function to click task
  const onTaskClick = (task: any) => {
    console.log('Task clicked:', task);
    setSelectedTask(task);
    dispatch(toggleFinanceDrawer());
  };

  useEffect(() => {
    console.log('Selected Task:', selectedTask);
  }, [selectedTask]);

  const renderFinancialTableHeaderContent = (columnKey: any) => {
    switch (columnKey) {
      case 'hours':
        return <Typography.Text>{totals.hours}</Typography.Text>;
      case 'cost':
        return <Typography.Text>{totals.cost}</Typography.Text>;
      case 'fixedCost':
        return <Typography.Text>{totals.fixedCost}</Typography.Text>;
      case 'totalBudget':
        return <Typography.Text>{totals.totalBudget}</Typography.Text>;
      case 'totalActual':
        return <Typography.Text>{totals.totalActual}</Typography.Text>;
      case 'variance':
        return (
          <Typography.Text
            style={{
              color: totals.variance < 0 ? '#FF0000' : '#6DC376',
            }}
          >
            {totals.variance}
          </Typography.Text>
        );
      default:
        return null;
    }
  };

  const renderFinancialTableColumnContent = (columnKey: any, task: any) => {
    switch (columnKey) {
      case 'task':
        return (
          <Tooltip title={task.task}>
            <Flex gap={8} align="center">
              <Typography.Text
                ellipsis={{ expanded: false }}
                style={{ maxWidth: 160 }}
              >
                {task.task}
              </Typography.Text>

              {task.isbBillable && <DollarCircleOutlined />}
            </Flex>
          </Tooltip>
        );
      case 'members':
        return (
          <Avatar.Group>
            {task.members.map((member: any) => (
              <CustomAvatar avatarName={member.name} size={26} />
            ))}
          </Avatar.Group>
        );
      case 'hours':
        return <Typography.Text>{task.hours}</Typography.Text>;
      case 'cost':
        return <Typography.Text>{task.cost}</Typography.Text>;
      case 'fixedCost':
        return (
          <Input
            value={task.fixedCost}
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              textAlign: 'right',
              padding: 0,
            }}
          />
        );
      case 'totalBudget':
        return (
          <Input
            value={task.totalBudget}
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              textAlign: 'right',
              padding: 0,
            }}
          />
        );
      case 'totalActual':
        return <Typography.Text>{task.totalActual}</Typography.Text>;
      case 'variance':
        return (
          <Typography.Text
            style={{
              color: task.variance < 0 ? '#FF0000' : '#6DC376',
            }}
          >
            {task.variance}
          </Typography.Text>
        );
      default:
        return null;
    }
  };

  // layout styles for table and the columns
  const customColumnHeaderStyles = (key: string) =>
    `px-2 text-left  ${key === 'tableTitle' && `sticky left-0 z-10 ${isScrolling ? 'after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:h-[40px] after:w-1.5 after:bg-transparent after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`}`;

  const customColumnStyles = (key: string) =>
    `px-2 text-left ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && 'sticky left-[48px] z-10'} ${key === 'members' && `sticky left-[288px] z-10 ${isScrolling ? 'after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:h-[52px] after:w-1.5 after:bg-transparent after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#1d1d1d] border-[#303030]' : 'bg-[#fafafa]'}`;

  return (
    <>
      {/* header row */}
      <tr
        style={{
          height: 40,
          backgroundColor: themeWiseColor(
            table.color_code_default,
            table.color_code_dark,
            themeMode
          ),
          fontWeight: 600,
        }}
        className="group"
      >
        <td
          colSpan={3}
          style={{
            width: 48,
            textTransform: 'capitalize',
            textAlign: 'left',
            paddingInline: 16,
            backgroundColor: themeWiseColor(
              table.color_code_default,
              table.color_code_dark,
              themeMode
            ),
            cursor: 'pointer',
          }}
          className={customColumnHeaderStyles('tableTitle')}
          onClick={(e) => setIsCollapse((prev) => !prev)}
        >
          <Flex gap={8} align="center">
            {isCollapse ? <RightOutlined /> : <DownOutlined />}
            {table.name} ({table.tasks.length})
          </Flex>
        </td>

        {financeTableColumns.map(
          (col) =>
            col.key !== 'task' &&
            col.key !== 'members' && (
              <td
                key={col.key}
                style={{
                  width: col.width,
                  paddingInline: 16,
                  textAlign: 'end',
                }}
              >
                {renderFinancialTableHeaderContent(col.key)}
              </td>
            )
        )}
      </tr>

      {/* task rows */}
      {table.tasks.map((task: any) => (
        <tr
          key={task.taskId}
          style={{ height: 52 }}
          className={`${isCollapse ? 'hidden' : 'static'} cursor-pointer border-b-[1px] ${themeMode === 'dark' ? 'hover:bg-[#000000]' : 'hover:bg-[#f8f7f9]'} `}
          onClick={() => onTaskClick(task)}
        >
          <td
            style={{ paddingInline: 16 }}
            className={customColumnStyles('selector')}
          >
            <Checkbox />
          </td>
          {financeTableColumns.map((col) => (
            <td
              key={col.key}
              className={customColumnStyles(col.key)}
              style={{
                width: col.width,
                paddingInline: 16,
                textAlign:
                  col.type === 'hours' || col.type === 'currency'
                    ? 'end'
                    : 'start',
              }}
            >
              {renderFinancialTableColumnContent(col.key, task)}
            </td>
          ))}
        </tr>
      ))}

      {selectedTask && <FinanceDrawer task={selectedTask} />}
    </>
  );
};

export default FinanceTable;
