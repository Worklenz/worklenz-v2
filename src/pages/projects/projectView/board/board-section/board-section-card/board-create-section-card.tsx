import { Button, Flex } from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { addBoardSectionCard } from '../../../../../../features/board/board-slice';
import { nanoid } from '@reduxjs/toolkit';

const BoardCreateSectionCard = () => {
  //   localization
  const { t } = useTranslation('kanbanBoard');

  //   get theme data from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // function to add section
  const handleAddSection = () => {
    dispatch(
      addBoardSectionCard({
        id: nanoid(),
        name: 'Untitled section',
        colorCode: '#d8d7d8',
        colorCodeDark: '#989898',
      })
    );
  };

  return (
    <Flex
      vertical
      gap={16}
      style={{
        minWidth: 375,
        padding: 8,
        borderRadius: 12,
      }}
      className="h-[600px] max-h-[600px] overflow-y-scroll"
    >
      <div
        style={{
          borderRadius: 6,
          padding: 8,
          height: 640,
          background: themeWiseColor(
            'linear-gradient( 180deg, #fafafa, rgba(245, 243, 243, 0))',
            'linear-gradient( 180deg, #2a2b2d, rgba(42, 43, 45, 0))',
            themeMode
          ),
        }}
      >
        <Button
          type="text"
          style={{
            height: '38px',
            width: '100%',
            borderRadius: 6,
            boxShadow: 'none',
          }}
          icon={<PlusOutlined />}
          onClick={handleAddSection}
        >
          {t('addSectionButton')}
        </Button>
      </div>
    </Flex>
  );
};

export default BoardCreateSectionCard;
