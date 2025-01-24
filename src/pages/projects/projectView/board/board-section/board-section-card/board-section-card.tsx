import { Button, Flex } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import BoardSectionCardHeader from './board-section-card-header';
import { PlusOutlined } from '@ant-design/icons';
import BoardViewTaskCard from '../board-task-card/board-view-task-card';
import BoardViewCreateTaskCard from '../board-task-card/board-view-create-task-card';

const BoardSectionCard = ({ datasource }: { datasource: any }) => {
  const [name, setName] = useState<string>(datasource.name);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [showNewCardTop, setShowNewCardTop] = useState<boolean>(false);
  const [showNewCardBottom, setShowNewCardBottom] = useState<boolean>(false);

  //   localization
  const { t } = useTranslation('kanbanBoard');

  //   get theme data from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // ref for the scrollable container
  const scrollContainerRef = useRef<any>(null);

  // useEffect to scroll to the bottom whenever a new card is added
  useEffect(() => {
    if (showNewCardBottom && scrollContainerRef.current) {
      const timeout = setTimeout(() => {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [datasource.tasks, showNewCardBottom]);

  return (
    <Flex
      vertical
      gap={16}
      style={{
        minWidth: 375,
        outline: isHover
          ? `1px solid ${themeWiseColor('#edeae9', '#ffffff12', themeMode)}`
          : 'none',
        padding: 8,
        borderRadius: 12,
      }}
      className="h-[600px] max-h-[600px] overflow-y-scroll"
    >
      <BoardSectionCardHeader
        id={datasource.id}
        name={name}
        tasksCount={datasource?.total_tasks_count || datasource?.tasks.length}
        isLoading={isLoading}
        setName={setName}
        colorCode={themeWiseColor(
          datasource?.color_code,
          datasource?.color_code_dark,
          themeMode
        )}
        onHoverChange={setIsHover}
        setShowNewCard={setShowNewCardTop}
      />

      <Flex
        vertical
        gap={16}
        ref={scrollContainerRef}
        style={{
          borderRadius: 6,
          height: datasource?.tasks.length <= 0 ? 600 : 'auto',
          maxHeight: datasource?.tasks.length <= 0 ? 600 : 'auto',
          overflowY: 'scroll',
          padding: datasource?.tasks.length <= 0 ? 8 : 1,
          background:
            datasource?.tasks.length <= 0 &&
            !showNewCardTop &&
            !showNewCardBottom
              ? themeWiseColor(
                  'linear-gradient( 180deg, #fafafa, rgba(245, 243, 243, 0))',
                  'linear-gradient( 180deg, #2a2b2d, rgba(42, 43, 45, 0))',
                  themeMode
                )
              : 'transparent',
        }}
      >
        <Flex vertical gap={16} align="center">
          {showNewCardTop && (
            <BoardViewCreateTaskCard
              position="top"
              sectionId={datasource.id}
              setShowNewCard={setShowNewCardTop}
            />
          )}

          {datasource.tasks.map((task: any) => (
            <BoardViewTaskCard sectionId={datasource.id} task={task} />
          ))}

          {showNewCardBottom && (
            <BoardViewCreateTaskCard
              position="bottom"
              sectionId={datasource.id}
              setShowNewCard={setShowNewCardBottom}
            />
          )}
        </Flex>

        <Button
          type="text"
          style={{
            height: '38px',
            width: '100%',
            borderRadius: 6,
            boxShadow: 'none',
          }}
          icon={<PlusOutlined />}
          onClick={() => setShowNewCardBottom(true)}
        >
          {t('addTask')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default BoardSectionCard;
