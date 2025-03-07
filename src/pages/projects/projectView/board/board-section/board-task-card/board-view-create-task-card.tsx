import { Button, Flex, Input } from 'antd';
import React, { useRef, useState } from 'react';
import { Dayjs } from 'dayjs';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  addTaskCardToTheBottom,
  addTaskCardToTheTop,
} from '@features/board/board-slice';
import { themeWiseColor } from '@/utils/themeWiseColor';
import { useAppSelector } from '@/hooks/useAppSelector';
import CustomDueDatePicker from '@/components/board/custom-due-date-picker';
import AddMembersDropdown from '@/components/add-members-dropdown-v2/add-members-dropdown';

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
  const { t } = useTranslation('kanban-board');
  const dispatch = useAppDispatch();

  const [newTaskName, setNewTaskName] = useState<string>('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const handleAddTaskToTheTop = () => {
    if (newTaskName.trim()) {
      dispatch(
        addTaskCardToTheTop({
          sectionId: sectionId,
          task: {
            name: newTaskName.trim(),
            end_date: dueDate,
          },
        })
      );
      setNewTaskName('');
      setShowNewCard(true);
      setDueDate(null);
    }
  };

  const handleAddTaskToTheBottom = () => {
    if (newTaskName.trim()) {
      dispatch(
        addTaskCardToTheBottom({
          sectionId: sectionId,
          task: {
            id: nanoid(),
            name: newTaskName.trim(),
            end_date: dueDate,
          },
        })
      );
      setNewTaskName('');
      setShowNewCard(true);
      setDueDate(null);
    }
  };

  const handleCancelNewCard = (e: React.FocusEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget)) {
      setNewTaskName('');
      setShowNewCard(false);
      setDueDate(null);
    }
  };

  return (
    <Flex
      ref={cardRef}
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
        onChange={e => setNewTaskName(e.target.value)}
        onPressEnter={position === 'bottom' ? handleAddTaskToTheBottom : handleAddTaskToTheTop}
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

      <Flex gap={8} align="center">
        <CustomDueDatePicker dueDate={dueDate} onDateChange={setDueDate} />

        <Button
          shape="circle"
          type="dashed"
          size="small"
          style={{
            background: 'transparent',
            boxShadow: 'none',
            width: 26,
            height: 26,
          }}
        >
          <AddMembersDropdown />
        </Button>
      </Flex>
    </Flex>
  );
};

export default BoardViewCreateTaskCard;
