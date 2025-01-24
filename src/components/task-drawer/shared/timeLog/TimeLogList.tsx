import { Flex } from 'antd';
import React, { useState } from 'react';
import TimeLogItem from './TimeLogItem';

type TimeLog = {
  logId: string;
  username: string;
  duration: string;
  date: string;
  via?: string;
};

type TimeLogListProps = {
  timeLoggedList: TimeLog[];
};

const TimeLogList = ({ timeLoggedList }: TimeLogListProps) => {
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  return (
    <Flex vertical gap={6}>
      {timeLoggedList.map((log) => (
        <TimeLogItem
          key={log.logId}
          log={log}
          onHover={setHoverRow}
          isHovered={hoverRow === log.logId}
        />
      ))}
    </Flex>
  );
};

export default TimeLogList;
