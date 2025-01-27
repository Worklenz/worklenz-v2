import { Button, Flex, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import CustomAvatar from '../../../../components/CustomAvatar';
import { colors } from '../../../../styles/colors';
import { LikeOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { themeWiseColor } from '../../../../utils/themeWiseColor';

const OthersChatBox = ({ update }: { update: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  //   theme details from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Flex vertical>
      <Flex gap={8}>
        <CustomAvatar avatarName={update.created_by} />
        <Flex
          vertical
          gap={16}
          style={{
            background: themeWiseColor('#D9D9D9', '#141414', themeMode),
            width: '100%',
            maxWidth: 600,
            padding: '12px 16px',
            borderRadius: '0 24px 24px 24px',
          }}
        >
          <Flex gap={12} align="center" justify="space-between">
            <Typography.Text style={{ color: colors.lightGray }}>
              {update.created_by}
            </Typography.Text>

            <Tooltip title={update.created_at}>
              <Typography.Text
                style={{ fontSize: 13, color: colors.lightGray }}
              >
                {update.created_at}
              </Typography.Text>
            </Tooltip>
          </Flex>

          <Typography.Paragraph
            style={{ marginBlockEnd: 0 }}
            ellipsis={{
              rows: 3,
              expandable: 'collapsible',
              onExpand: () => setIsExpanded(!isExpanded),
              symbol: isExpanded ? null : 'Read More',
            }}
          >
            <>
              {update?.mentions?.map((mention: any, index: any) => (
                <Tag
                  key={index}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    background: '#f7f7f760',
                  }}
                >
                  @{mention.user_name}
                </Tag>
              ))}
            </>
            {update.content}
          </Typography.Paragraph>

          <Flex gap={2} align="center">
            <Button
              icon={<LikeOutlined style={{ color: colors.lightGray }} />}
              style={{
                background: 'transparent',
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
              }}
            />
            <Typography.Text style={{ fontSize: 13, color: colors.lightGray }}>
              {update.likes}
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OthersChatBox;
