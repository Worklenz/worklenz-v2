import React from 'react';
import { Tooltip, Progress, Typography, Space } from 'antd';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleScheduleDrawer } from '../../../features/schedule/scheduleSlice';
import { ClockCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/useAppSelector';

const { Text } = Typography;

type DayAllocationCellProps = {
  totalPerDayHours: number;
  loggedHours: number;
  workingHours: number;
  isWeekend: boolean;
};

const DayAllocationCell = ({
  totalPerDayHours,
  loggedHours,
  workingHours,
  isWeekend,
}: DayAllocationCellProps) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  // If it's a weekend, override values and disable interaction
  const effectiveTotalPerDayHours = isWeekend ? 0 : totalPerDayHours;
  const effectiveLoggedHours = isWeekend ? 0 : loggedHours;
  const effectiveWorkingHours = isWeekend ? 1 : workingHours; // Avoid division by zero

  // Calculate utilization percentage and status
  const totalUtilization = ((effectiveTotalPerDayHours + effectiveLoggedHours) / effectiveWorkingHours) * 100;
  const isOverAllocated = totalUtilization > 100;
  const isUnderAllocated = totalUtilization < 100 && totalUtilization > 0;
  const isZeroAllocated = totalUtilization === 0;

  const remainingHours = Math.max(0, effectiveWorkingHours - effectiveTotalPerDayHours - effectiveLoggedHours);

  // Status colors
  const getStatusColor = () => {
    if (isWeekend) return { color: '#d9d9d9', icon: null };
    if (isOverAllocated) return { color: '#ff4d4f', icon: <WarningOutlined /> };
    if (isZeroAllocated) return { color: '#d9d9d9', icon: <ClockCircleOutlined /> };
    if (isUnderAllocated) return { color: '#52c41a', icon: <CheckCircleOutlined /> };
    return { color: '#1890ff', icon: null };
  };

  const { color: statusColor, icon: statusIcon } = getStatusColor();

  const tooltipContent = (
    <Space direction="vertical" size={1}>
      <Text strong style={{ color: 'white', marginBottom: 4 }}>
        {isWeekend ? 'Weekend' : isOverAllocated ? 'Over Allocated' : isZeroAllocated ? 'No Allocation' : 'Available Time'}
      </Text>
      {!isWeekend && (
        <>
          <Text style={{ color: 'white' }}>
            Working Hours: {effectiveWorkingHours}h
          </Text>
          <Text style={{ color: 'white' }}>
            Allocated: {effectiveTotalPerDayHours}h
          </Text>
          <Text style={{ color: 'white' }}>
            Logged: {effectiveLoggedHours}h
          </Text>
          <Text style={{ color: statusColor }}>
            {isOverAllocated
              ? `Overallocated by ${(effectiveTotalPerDayHours + effectiveLoggedHours - effectiveWorkingHours).toFixed(1)}h`
              : `Remaining: ${remainingHours.toFixed(1)}h`}
          </Text>
        </>
      )}
    </Space>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px',
        height: '90px', // Exact height to match team member rows
        width: '100%',
        boxSizing: 'border-box',
        flexDirection: 'column',
        pointerEvents: isWeekend ? 'none' : 'auto',
        backgroundColor: isWeekend 
          ? (themeMode === 'dark' ? 'rgba(40, 40, 40, 0.4)' : 'rgba(240, 240, 240, 0.4)') 
          : 'transparent',
      }}
    >
      <Tooltip title={tooltipContent} color={themeMode === 'dark' ? '#141414' : undefined}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: isWeekend ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            padding: '4px',
            border: `1px solid ${isWeekend ? 'transparent' : themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            transition: 'all 0.2s',
            background: themeMode === 'dark' ? '#1f1f1f' : '#fafafa',
            boxShadow: isWeekend ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          className={isWeekend ? '' : 'day-cell-hover'}
          onClick={!isWeekend ? () => dispatch(toggleScheduleDrawer()) : undefined}
        >
          {isWeekend ? (
            <Text type="secondary" style={{ fontSize: '12px' }}>Weekend</Text>
          ) : (
            <>
              <div style={{ marginBottom: 8, textAlign: 'center' }}>
                {statusIcon && (
                  <span style={{ color: statusColor, marginRight: 4 }}>{statusIcon}</span>
                )}
                <Text 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: isOverAllocated ? 'bold' : 'normal',
                    color: isOverAllocated 
                      ? (themeMode === 'dark' ? '#ff7875' : '#f5222d') 
                      : (themeMode === 'dark' ? '#d9d9d9' : 'inherit')
                  }}
                >
                  {effectiveLoggedHours + effectiveTotalPerDayHours}h
                  {isOverAllocated && '+'}
                </Text>
              </div>
              <Progress 
                percent={Math.min(100, totalUtilization)} 
                size="small"
                showInfo={false}
                strokeColor={statusColor}
                trailColor={themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                style={{ width: '100%', marginBottom: 4 }}
              />
              <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center' }}>
                {isOverAllocated 
                  ? 'Over'
                  : isZeroAllocated
                    ? 'Free'
                    : `${remainingHours}h left`}
              </Text>
            </>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

// Add CSS for hover styles
const style = document.createElement('style');
style.innerHTML = `
  .day-cell-hover:hover {
    border-color: #1890ff !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
`;
document.head.appendChild(style);

export default React.memo(DayAllocationCell);
