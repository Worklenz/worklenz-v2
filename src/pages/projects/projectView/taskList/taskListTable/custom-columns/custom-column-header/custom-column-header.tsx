import {
  CloseCircleOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { Button, Flex, Popconfirm, Tooltip, Typography } from 'antd';
import React from 'react';
import { colors } from '../../../../../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../../../../hooks/useAppDispatch';
import { deleteCustomColumn } from '../../../../../../../features/projects/singleProject/taskListColumns/taskColumnsSlice';

type CustomColumnHeaderProps = {
  columnKey: string;
  columnName: string;
};

const CustomColumnHeader = ({
  columnKey,
  columnName,
}: CustomColumnHeaderProps) => {
  // localization
  const { t } = useTranslation('taskListTable');

  const dispatch = useAppDispatch();

  return (
    <Flex gap={8} align="center" justify="space-between">
      <Typography.Text>{columnName}</Typography.Text>
      <Popconfirm
        title={t('deleteConfirmationTitle')}
        icon={
          <ExclamationCircleFilled style={{ color: colors.vibrantOrange }} />
        }
        okText={t('deleteConfirmationOk')}
        cancelText={t('deleteConfirmationCancel')}
        onConfirm={() => dispatch(deleteCustomColumn(columnKey))}
      >
        <Tooltip title={t('deleteTooltip')}>
          <Button
            icon={<CloseCircleOutlined />}
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              fontSize: 12,
            }}
          />
        </Tooltip>
      </Popconfirm>
    </Flex>
  );
};

export default CustomColumnHeader;
