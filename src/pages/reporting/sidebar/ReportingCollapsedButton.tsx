import {
  GlobalOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import React from 'react';
import { colors } from '../../../styles/colors';
import { Button, Flex, Tooltip, Typography } from 'antd';
import { themeWiseColor } from '../../../utils/themeWiseColor';
import { useAppSelector } from '../../../hooks/useAppSelector';

const ReportingCollapsedButton = ({
  isCollapsed,
  handleCollapseToggler,
}: {
  isCollapsed: boolean;
  handleCollapseToggler: () => void;
}) => {
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Tooltip
      title={!isCollapsed && 'Current organization'}
      placement="right"
      trigger={'hover'}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          marginBlockStart: 76,
          marginBlockEnd: 24,
          maxWidth: 160,
          height: 40,
        }}
      >
        {!isCollapsed && (
          <Flex gap={8} align="center" style={{ marginInlineStart: 16 }}>
            <GlobalOutlined
              style={{
                color: themeWiseColor(colors.darkGray, colors.white, themeMode),
              }}
            />

            <Typography.Text strong>Ceydigital</Typography.Text>
          </Flex>
        )}
        <Button
          className="borderless-icon-btn"
          style={{
            background: themeWiseColor(
              colors.white,
              colors.darkGray,
              themeMode
            ),
            boxShadow: 'none',
            padding: 0,
            zIndex: 120,
            transform: 'translateX(50%)',
          }}
          onClick={() => handleCollapseToggler()}
          icon={
            isCollapsed ? (
              <RightCircleOutlined
                style={{
                  fontSize: 22,
                  color: themeWiseColor('#c5c5c5', colors.lightGray, themeMode),
                }}
              />
            ) : (
              <LeftCircleOutlined
                style={{
                  fontSize: 22,
                  color: themeWiseColor('#c5c5c5', colors.lightGray, themeMode),
                }}
              />
            )
          }
        />
      </Flex>
    </Tooltip>
  );
};

export default ReportingCollapsedButton;
