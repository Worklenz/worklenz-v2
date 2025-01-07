import { Flex, Input } from 'antd';
import React, { useState } from 'react';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import {
  addTaskCardToTheBottom,
  addTaskCardToTheTop,
} from '../../../../../../features/board/board-slice';
import { useTranslation } from 'react-i18next';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import PriorityDropdown from '../../../../../../components/taskListCommon/priorityDropdown/PriorityDropdown';
import CustomDueDatePicker from '../../../../../../components/board/custom-due-date-picker';
import { Dayjs } from 'dayjs';

type BoardViewCreateTaskCardProps = {
  position: 'top' | 'bottom';
  sectionId: string;
  setShowNewCard: (x: boolean) => void;
};

const BoardViewCreateTaskCard = ({
  position,
  sectionId,
  setShowNewCard,
}: BoardViewCreateTaskCardProps) => {
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  //   localization
  const { t } = useTranslation('kanbanBoard');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // function to add task card to the top
  const handleAddTaskToTheTop = () => {
    if (newTaskName.trim()) {
      dispatch(
        addTaskCardToTheTop({
          sectionId: sectionId,
          task: { name: newTaskName.trim() },
        })
      );
      setNewTaskName('');
      setShowNewCard(true);
    }
  };

  // function to add task card to the bottom
  const handleAddTaskToTheBottom = () => {
    if (newTaskName.trim()) {
      dispatch(
        addTaskCardToTheBottom({
          sectionId: sectionId,
          task: { name: newTaskName.trim() },
        })
      );
      setNewTaskName('');
      setShowNewCard(true);
    }
  };

  const handleCancelNewCard = () => {
    setNewTaskName('');
    setShowNewCard(false);
  };

  return (
    <Flex
      vertical
      gap={12}
      style={{
        width: '100%',
        padding: 12,
        backgroundColor: themeMode === 'dark' ? '#292929' : '#fafafa',
        borderRadius: 6,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      className={`outline-1 ${themeWiseColor('outline-[#edeae9]', 'outline-[#6a696a]', themeMode)} hover:outline`}
      onBlur={handleCancelNewCard}
    >
      <Input
        autoFocus
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        onPressEnter={
          position === 'bottom'
            ? handleAddTaskToTheBottom
            : handleAddTaskToTheTop
        }
        onBlur={
          newTaskName.length > 0 && position === 'bottom'
            ? handleAddTaskToTheBottom
            : handleAddTaskToTheTop
        }
        placeholder={t('newTaskNamePlaceholder')}
        style={{
          width: '100%',
          borderRadius: 6,
          padding: 8,
        }}
      />

      <CustomDueDatePicker dueDate={dueDate} onDateChange={setDueDate} />
    </Flex>
  );
};

export default BoardViewCreateTaskCard;
