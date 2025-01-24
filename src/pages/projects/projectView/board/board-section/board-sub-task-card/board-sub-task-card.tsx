import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { Col, Flex, Typography, List } from 'antd';
import CustomAvatarGroup from '../../../../../../components/board/custom-avatar-group';
import CustomDueDatePicker from '../../../../../../components/board/custom-due-date-picker';

const BoardSubTaskCard = ({ subtask }: { subtask: any }) => {
  const [subtaskDueDate, setSubtaskDueDate] = useState<Dayjs | null>(
    subtask?.end_date ? dayjs(subtask?.end_date) : null
  );

  // localization
  const { t } = useTranslation('kanbanBoard');

  return (
    <List.Item
      key={subtask.id}
      className="group"
      style={{
        width: '100%',
      }}
    >
      <Col span={10}>
        <Typography.Text
          style={{ fontWeight: 500, fontSize: 14 }}
          delete={subtask.status === 'done'}
          ellipsis={{ expanded: false }}
        >
          {subtask.name}
        </Typography.Text>
      </Col>

      <Flex gap={8} justify="end" style={{ width: '100%' }}>
        <CustomAvatarGroup assignees={subtask?.assignees} />

        <CustomDueDatePicker
          dueDate={subtaskDueDate}
          onDateChange={setSubtaskDueDate}
        />
      </Flex>
    </List.Item>
  );
};

export default BoardSubTaskCard;
