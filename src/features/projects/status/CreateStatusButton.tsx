import { SettingOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleDrawer } from './StatusSlice';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';

const CreateStatusButton = () => {
  // localization
  const { t } = useTranslation('task-list-filters');

  const dispatch = useAppDispatch();

  return (
    <Tooltip title={t('createStatusButtonTooltip')}>
      <Button
        className="borderless-icon-btn"
        style={{ backgroundColor: colors.transparent, boxShadow: 'none' }}
        onClick={() => dispatch(toggleDrawer())}
        icon={
          <SettingOutlined
            style={{
              color: colors.skyBlue,
            }}
          />
        }
      />
    </Tooltip>
  );
};

export default CreateStatusButton;
