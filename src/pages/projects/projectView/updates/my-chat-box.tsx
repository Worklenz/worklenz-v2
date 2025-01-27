import { Button, Flex, Tag, Tooltip, Typography, Input } from 'antd';
import React, { useState } from 'react';
import { colors } from '../../../../styles/colors';
import {
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { themeWiseColor } from '../../../../utils/themeWiseColor';
import { useTranslation } from 'react-i18next';
import { simpleDateFormat } from '../../../../utils/simpleDateFormat';
import { durationDateFormat } from '../../../../utils/durationDateFormat';

const MyChatBox = ({ update }: { update: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(update.content);

  // localization
  const { t } = useTranslation('projectViewUpdatesTab');

  // theme details from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const handleSaveEdit = () => {
    console.log('Saved content:', editedContent);
    setIsEditing(false);
  };

  return (
    <Flex vertical align="flex-end">
      <Flex
        vertical
        gap={16}
        style={{
          background: themeWiseColor('#98ccfc', '#153450', themeMode),
          width: '100%',
          maxWidth: 560,
          padding: '12px 16px',
          borderRadius: '24px 0 24px 24px',
        }}
      >
        <Flex gap={12} align="center" justify="space-between">
          <Typography.Text
            style={{
              color: themeWiseColor(
                colors.lightGray,
                colors.deepLightGray,
                themeMode
              ),
            }}
          >
            {t('youText')}
          </Typography.Text>

          <Tooltip title={simpleDateFormat(update.created_at)}>
            <Typography.Text style={{ fontSize: 13, color: colors.lightGray }}>
              {durationDateFormat(update.created_at)}
            </Typography.Text>
          </Tooltip>
        </Flex>

        {isEditing ? (
          <Input.TextArea
            autoFocus
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ marginBlockEnd: 0, borderRadius: 8 }}
          />
        ) : (
          <Typography.Paragraph
            style={{ marginBlockEnd: 0 }}
            ellipsis={{
              rows: 3,
              expandable: 'collapsible',
              onExpand: () => setIsExpanded((prev) => !prev),
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
            {editedContent}
          </Typography.Paragraph>
        )}

        <Flex gap={6} justify="space-between">
          <Flex gap={2} align="center">
            <Button
              icon={
                <LikeOutlined
                  style={{
                    color: themeWiseColor(
                      colors.lightGray,
                      colors.deepLightGray,
                      themeMode
                    ),
                  }}
                />
              }
              style={{
                background: 'transparent',
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
              }}
            />

            <Typography.Text
              style={{
                fontSize: 13,
                color: themeWiseColor(
                  colors.lightGray,
                  colors.deepLightGray,
                  themeMode
                ),
              }}
            >
              {update.likes}
            </Typography.Text>
          </Flex>

          <Flex>
            <Button
              icon={
                <DeleteOutlined
                  style={{
                    color: themeWiseColor(
                      '#1f5383',
                      colors.deepLightGray,
                      themeMode
                    ),
                  }}
                />
              }
              style={{
                background: 'transparent',
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
              }}
            />
            {isEditing ? (
              <Button
                icon={
                  <SaveOutlined
                    style={{
                      color: themeWiseColor(
                        '#1f5383',
                        colors.deepLightGray,
                        themeMode
                      ),
                    }}
                  />
                }
                onClick={handleSaveEdit}
                style={{
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
            ) : (
              <Button
                icon={
                  <EditOutlined
                    style={{
                      color: themeWiseColor(
                        '#1f5383',
                        colors.deepLightGray,
                        themeMode
                      ),
                    }}
                  />
                }
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MyChatBox;
