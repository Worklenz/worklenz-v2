// DayAllocationCell.jsx
import React from 'react';
import { Tooltip } from 'antd';

type DayAllocationCellProps = {
  currentDay: Date;
  weekends: boolean[];
  totalPerDayHours: number;
  loggedHours: number;
  workingHours: number;
  onClick: () => void;
  isWeekend: boolean;
};

const DayAllocationCell = ({
  currentDay,
  weekends,
  totalPerDayHours,
  loggedHours,
  workingHours,
  onClick,
  isWeekend,
}: DayAllocationCellProps) => {
  const isToday = currentDay.toDateString() === new Date().toDateString();

  const tooltipContent = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>Total Allocation: {totalPerDayHours + loggedHours}h</span>
      <span>Time Logged: {loggedHours}h</span>
      <span>Remaining Time: {totalPerDayHours}h</span>
    </div>
  );

  const gradientColor =
    totalPerDayHours <= 0
      ? 'rgba(200, 200, 200, 0.35)'
      : totalPerDayHours <= workingHours
        ? 'rgba(6, 126, 252, 0.4)'
        : 'rgba(255, 0, 0, 0.4)';

  return (
    <div
      style={{
        fontSize: '14px',
        backgroundColor: isWeekend ? 'rgba(217, 217, 217, 0.4)' : '',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 7px',
        height: '92px',
        flexDirection: 'column',
      }}
    >
      <Tooltip title={tooltipContent}>
        <div
          style={{
            width: '63px',
            background: `linear-gradient(to top, ${gradientColor} ${
              (totalPerDayHours * 100) / workingHours
            }%, rgba(190, 190, 190, 0.25) ${
              (totalPerDayHours * 100) / workingHours
            }%)`,
            justifyContent: loggedHours > 0 ? 'flex-end' : 'center',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            borderRadius: '5px',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
          onClick={onClick}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: `${(totalPerDayHours * 100) / workingHours}%`,
            }}
          >
            {totalPerDayHours}h
          </span>
          {loggedHours > 0 && (
            <span
              style={{
                height: `${(loggedHours * 100) / workingHours}%`,
                backgroundColor: 'rgba(98, 210, 130, 1)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
              }}
            >
              {loggedHours}h
            </span>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default React.memo(DayAllocationCell);
