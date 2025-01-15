import { Flex, Input } from 'antd';
import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { addSubtask } from '../../../../../../features/board/board-slice';
import { useTranslation } from 'react-i18next';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';

type BoardCreateSubtaskCardProps = {
  sectionId: string;
  taskId: string;
  setShowNewSubtaskCard: (x: boolean) => void;
};

const BoardCreateSubtaskCard = ({
  sectionId,
  taskId,
  setShowNewSubtaskCard,
}: BoardCreateSubtaskCardProps) => {
  const [newSubtaskName, setNewSubtaskName] = useState<string>('');

  const cardRef = useRef<HTMLDivElement>(null);

  //   localization
  const { t } = useTranslation('kanbanBoard');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // function to add task card to the top
  const handleAddSubtask = () => {
    if (newSubtaskName.trim()) {
      dispatch(
        addSubtask({
          sectionId: sectionId,
          taskId: taskId,
          subtask: {
            name: newSubtaskName.trim(),
          },
        })
      );
      setNewSubtaskName('');
      setShowNewSubtaskCard(true);
    }
  };

  const handleCancelNewCard = (e: React.FocusEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget)) {
      setNewSubtaskName('');
      setShowNewSubtaskCard(false);
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
        value={newSubtaskName}
        onChange={(e) => setNewSubtaskName(e.target.value)}
        onPressEnter={handleAddSubtask}
        onBlur={newSubtaskName.length > 0 ? handleAddSubtask : () => null}
        placeholder={t('newSubtaskNamePlaceholder')}
        style={{
          width: '100%',
          borderRadius: 6,
          padding: 8,
        }}
      />
    </Flex>
  );
};

export default BoardCreateSubtaskCard;
