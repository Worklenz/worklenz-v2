import { SettingOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { toggleDrawer } from './phaseSlice';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { colors } from '../../../../styles/colors';
import { useTranslation } from 'react-i18next';

const ConfigPhaseButton = ({ color }: { color: string }) => {
  // get theme details from redux
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // localization
  const { t } = useTranslation('task-list-filters');

  const dispatch = useAppDispatch();

  return (
    <Tooltip title={t('configPhaseButtonTooltip')}>
      <Button
        className="borderless-icon-btn"
        style={{ backgroundColor: colors.transparent, boxShadow: 'none' }}
        onClick={() => dispatch(toggleDrawer())}
        icon={
          <SettingOutlined
            style={{
              color:
                color !== colors.darkGray
                  ? color
                  : themeMode === 'dark'
                    ? colors.white
                    : colors.darkGray,
            }}
          />
        }
      />
    </Tooltip>
  );
};

export default ConfigPhaseButton;
