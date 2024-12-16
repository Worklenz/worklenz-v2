import { Button, ConfigProvider, Flex, Form, Mentions, Space, Tooltip, Typography } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import CustomAvatar from '@components/CustomAvatar';
import { colors } from '@/styles/colors';
import {
  IMentionMemberSelectOption,
  IMentionMemberViewModel,
} from '@/types/project/projectComments.types';
import { projectsApiService } from '@/api/projects/projects.api.service';
import { useParams } from 'react-router-dom';
import { projectCommentsApiService } from '@/api/projects/comments/project-comments.api.service';
import { IProjectUpdateCommentViewModel } from '@/types/project/project.types';
import { calculateTimeAgo } from '@/utils/calculateTimeAgo';
import { getSession } from '@/utils/session-helper';

const MAX_COMMENT_LENGTH = 2000;

const ProjectViewUpdates = () => {
  const { projectId } = useParams();
  const [characterLength, setCharacterLength] = useState<number>(0);
  const [isCommentBoxExpand, setIsCommentBoxExpand] = useState<boolean>(false);
  const [members, setMembers] = useState<IMentionMemberViewModel[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<{ id: string; name: string }[]>([]);
  const [comments, setComments] = useState<IProjectUpdateCommentViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { t } = useTranslation('project-view-updates');
  const [form] = Form.useForm();

  const getMembers = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const res = await projectsApiService.getMembers(projectId, 1, 15, null, null, null);
      if (res.done) {
        setMembers(res.body.data as IMentionMemberViewModel[]);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const getComments = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await projectCommentsApiService.getByProjectId(projectId);
      if (res.done) {
        setComments(res.body);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, [projectId]);

  const handleAddComment = async () => {
    if (!projectId || characterLength === 0) return;
    
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const commentContent = values.comment;
      
      const body = {  
        project_id: projectId,
        team_id: getSession()?.team_id,
        content: commentContent.trim(),
        mentions: selectedMembers.map(member => ({
          id: member.id,
          name: member.name,
        })),
      };

      const res = await projectCommentsApiService.createProjectComment(body);
      if (res.done) {
        await getComments();
        handleCancel();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    void getMembers();
    void getComments();
  }, [getMembers, getComments]);

  const handleCancel = useCallback(() => {
    form.resetFields(['comment']);
    setCharacterLength(0);
    setIsCommentBoxExpand(false);
    setSelectedMembers([]);
  }, [form]);

  const mentionsOptions = members?.map(member => ({
    value: member.id,
    label: member.name,
  })) ?? [];

  const memberSelectHandler = useCallback((member: IMentionMemberSelectOption) => {
    if (!member?.value || !member?.label) return;
    setSelectedMembers(prev =>
      prev.some(mention => mention.id === member.value)
        ? prev
        : [...prev, { id: member.value, name: member.label }]
    );
  }, []);

  const handleCommentChange = useCallback((value: string) => {
    setCharacterLength(value.trim().length);
  }, []);

  const handleDeleteComment = useCallback(async (commentId: string | undefined) => {
    if (!commentId) return;
    try {
      const res = await projectCommentsApiService.deleteComment(commentId);
      if (res.done) {
        void getComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }, [getComments]);

  return (
    <Flex gap={24} vertical>
      <Flex vertical gap={16}>
        {comments.map(comment => (
          <Flex key={comment.id} gap={8}>
            <CustomAvatar avatarName={comment.created_by || ''} />
            <Flex vertical flex={1}>
              <Space>
                <Typography.Text strong style={{ fontSize: 13, color: colors.lightGray }}>
                  {comment.created_by || ''}
                </Typography.Text>
                <Tooltip title={comment.created_at}>
                  <Typography.Text style={{ fontSize: 13, color: colors.deepLightGray }}>
                    {calculateTimeAgo(comment.created_at || '')}
                  </Typography.Text>
                </Tooltip>
              </Space>
              <Typography.Paragraph style={{ margin: '8px 0' }}>{comment.content}</Typography.Paragraph>
              <ConfigProvider
                wave={{ disabled: true }}
                theme={{
                  components: {
                    Button: {
                      defaultColor: colors.lightGray,
                      defaultHoverColor: colors.darkGray,
                    },
                  },
                }}
              >
                <Button
                  style={{
                    width: 'fit-content',
                    border: 'none',
                    padding: 0,
                    fontSize: 13,
                    height: 24,
                  }}
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  {t('deleteButton')}
                </Button>
              </ConfigProvider>
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Form form={form} onFinish={handleAddComment}>
        <Form.Item name="comment">
          <Mentions
            placeholder={t('inputPlaceholder')}
            loading={isLoading}
            options={mentionsOptions}
            autoSize
            maxLength={MAX_COMMENT_LENGTH}
            onSelect={option => memberSelectHandler(option as IMentionMemberSelectOption)}
            onClick={() => setIsCommentBoxExpand(true)}
            onChange={handleCommentChange}
            style={{
              minHeight: isCommentBoxExpand ? 180 : 60,
              paddingBlockEnd: 24,
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              right: 12,
              color: colors.lightGray,
            }}
          >{`${characterLength}/${MAX_COMMENT_LENGTH}`}</span>
        </Form.Item>

        {isCommentBoxExpand && (
          <Form.Item>
            <Flex gap={8} justify="flex-end">
              <Button onClick={handleCancel} disabled={isSubmitting}>
                {t('cancelButton')}
              </Button>
              <Button 
                type="primary" 
                loading={isSubmitting}
                disabled={characterLength === 0} 
                htmlType="submit"
              >
                {t('addButton')}
              </Button>
            </Flex>
          </Form.Item>
        )}
      </Form>
    </Flex>
  );
};

export default ProjectViewUpdates;
