import { Button, Card, Dropdown, Flex, Input, InputRef, MenuProps } from 'antd';
import React, { ChangeEvent, useState } from 'react';
import StatusDropdown from '../../../../components/taskListCommon/statusDropdown/StatusDropdown';
import { colors } from '../../../../styles/colors';
import { EllipsisOutlined } from '@ant-design/icons';

type TaskDrawerHeaderProps = {
  taskName: string;
  setTaskName: (name: string) => void;
  inputRef: React.RefObject<InputRef>;
};

const TaskDrawerHeader = ({
  taskName,
  setTaskName,
  inputRef,
}: TaskDrawerHeaderProps) => {
  const [characterLength, setCharacterLength] = useState<number>(
    taskName.length
  );
  const [isCharacterLengthShowing, setIsCharacterLengthShowing] =
    useState<boolean>(false);

  // function to set task name
  const onTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.currentTarget.value);
    setCharacterLength(e.currentTarget.value.length);
  };

  // delete task dropdown items
  const deletTaskDropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card className="delete-task-dropdown-card" bordered={false}>
          <Button type="text" className="delete-task-button">
            Delete Task
          </Button>
        </Card>
      ),
    },
  ];

  return (
    <Flex gap={12} align="center" style={{ marginBlockEnd: 6 }}>
      <Flex style={{ position: 'relative', width: '100%' }}>
        <Input
          ref={inputRef}
          size="large"
          value={taskName}
          onChange={(e) => onTaskNameChange(e)}
          onFocus={() => setIsCharacterLengthShowing(true)}
          onBlur={() => setIsCharacterLengthShowing(false)}
          placeholder="Type your Task"
          style={{ width: '100%' }}
        />
        {isCharacterLengthShowing && (
          <span
            style={{
              position: 'absolute',
              bottom: -20,
              right: 0,
              color: colors.lightGray,
              fontSize: 11.2,
            }}
          >{`${characterLength}/250`}</span>
        )}
      </Flex>
      <StatusDropdown currentStatus="todo"/>
      {/* delete todo menu  */}
      <Dropdown
        overlayClassName={'delete-task-dropdown'}
        menu={{ items: deletTaskDropdownItems }}
      >
        <Button icon={<EllipsisOutlined />} className="borderless-icon-btn" />
      </Dropdown>
    </Flex>
  );
};

export default TaskDrawerHeader;
