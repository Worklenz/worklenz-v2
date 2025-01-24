/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  Flex,
  Input,
  InputRef,
  List,
  Typography,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { colors } from '../../../styles/colors';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { LabelType } from '../../../types/label.type';
import { nanoid } from '@reduxjs/toolkit';
import { addLabel } from '../../../features/settings/label/labelSlice';
import { toggleLabel } from '../../../features/tasks/taskSlice';
import { useTranslation } from 'react-i18next';

const LabelsSelector = ({ taskId }: { taskId: string }) => {
  const labelInputRef = useRef<InputRef>(null);
  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('task-list-table');

  // get label list from label reducer
  const labelList = useAppSelector((state) => state.labelReducer.labelList);
  const dispatch = useAppDispatch();

  // get task list from redux and find the selected task
  const selectedTask = useAppSelector((state) => state.taskReducer.tasks).find(
    (task) => task.taskId === taskId
  );

  // used useMemo hook for re render the list when searching
  const filteredLabelData = useMemo(() => {
    return labelList.filter((label) =>
      label.labelName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [labelList, searchQuery]);

  const handleCreateLabel = (labelName: string) => {
    if (labelName.length > 0) {
      const newLabel: LabelType = {
        labelId: nanoid(),
        labelName,
        labelColor: '#1E90FF',
      };

      dispatch(addLabel(newLabel));
      setSearchQuery('');
    }
  };

  // custom dropdown content
  const labelDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8, overflow: 'hidden', overflowY: 'auto', maxHeight: '255px'} }}>
      <Flex vertical gap={8}>
        <Input
          ref={labelInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={t('labelInputPlaceholder')}
          onKeyDown={(e) => {
            const isLabel = filteredLabelData.findIndex(
              (label) => label.labelName.toLowerCase === searchQuery.toLowerCase
            );

            if (isLabel === -1) {
              if (e.key === 'Enter') {
                handleCreateLabel(searchQuery);
              }
            }
          }}
        />

        <List style={{ padding: 0, maxHeight: 300, overflow: 'scroll' }}>
          {filteredLabelData.length ? (
            filteredLabelData.map((label) => (
              <List.Item
                className="custom-list-item"
                key={label.labelId}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox
                  id={label.labelId}
                  checked={
                    selectedTask?.labels
                      ? selectedTask?.labels.some(
                          (existingLabel) =>
                            existingLabel.labelId === label.labelId
                        )
                      : false
                  }
                  onChange={() => dispatch(toggleLabel({ taskId, label }))}
                />

                <Flex gap={8}>
                  <Badge color={label.labelColor} />
                  {label.labelName}
                </Flex>
              </List.Item>
            ))
          ) : (
            <Typography.Text
              style={{ color: colors.lightGray }}
              onClick={() => handleCreateLabel(searchQuery)}
            >
              {t('labelsSelectorInputTip')}
            </Typography.Text>
          )}
        </List>

        <Divider style={{ margin: 0 }} />

        <Button
          type="primary"
          style={{ alignSelf: 'flex-end' }}
          onClick={() => handleCreateLabel(searchQuery)}
        >
          {t('okButton')}
        </Button>
      </Flex>
    </Card>
  );

  // function to focus label input
  const handleLabelDropdownOpen = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        labelInputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => labelDropdownContent}
      onOpenChange={handleLabelDropdownOpen}
    >
      <Button
        type="dashed"
        icon={<PlusOutlined style={{ fontSize: 11 }} />}
        style={{ height: 18 }}
        size="small"
      />
    </Dropdown>
  );
};

export default LabelsSelector;
