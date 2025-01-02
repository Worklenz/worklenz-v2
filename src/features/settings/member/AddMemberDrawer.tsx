import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  message,
  Select,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { addMember, toggleCreateMemberDrawer } from './memberSlice';
import { MemberType } from '../../../types/member.types';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

const AddMemberDrawer = () => {
  const [emailQuery, setEmailQuery] = useState('');
  const [membersEmails, setMembersEmails] = useState<string[]>([]);

  // localization
  const { t } = useTranslation('teamMembersSettings');

  const isDrawerOpen = useAppSelector(
    (state) => state.memberReducer.isCreateMemberDrawerOpen
  );
  const dispatch = useAppDispatch();

  // get job titles from redux - job reducer
  const jobsList = useAppSelector((state) => state.jobReducer.jobsList);

  const [form] = Form.useForm();

  // function to add members into selected members array
  const onSelectEmail = (value: string) => {
    if (!membersEmails.includes(value)) {
      setMembersEmails([...membersEmails, value]);
    }
  };

  // function to handle form submit
  const handleFormSubmit = async (values: any) => {
    try {
      const newMembers = membersEmails.map((email) => ({
        memberId: nanoid(),
        memberName: email.split('@')[0] || '',
        memberEmail: email,
        memberRole: values.access,
        jobTitle: values.jobTitle,
        isActivate: null,
        isInivitationAccept: false,
      }));

      // dispatch each new member
      newMembers.forEach((member) => dispatch(addMember(member)));

      form.resetFields();
      setMembersEmails([]); // Clear the emails array
      message.success(t('createMemberSuccessMessage'));
      dispatch(toggleCreateMemberDrawer());
    } catch (error) {
      message.error(t('createMemberErrorMessage'));
    }
  };

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          {t('addMemberDrawerTitle')}
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleCreateMemberDrawer())}
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        initialValues={{ access: 'member' }}
      >
        <Form.Item
          name="email"
          label={t('memberEmailLabel')}
          rules={[
            {
              type: 'email',
              required: true,
              message: t('memberEmailRequiredError'),
            },
          ]}
        >
          <Flex vertical gap={4}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder={t('memberEmailPlaceholder')}
              onChange={onSelectEmail}
              suffixIcon={null}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t('addMemberEmailHint')}
            </Typography.Text>
          </Flex>
        </Form.Item>

        <Form.Item label="Job Title" name="jobTitle">
          <Select
            size="middle"
            placeholder={t('jobTitlePlaceholder')}
            options={jobsList.map((job) => ({
              label: job.jobTitle,
              value: job.jobTitle,
            }))}
            suffixIcon={false}
          />
        </Form.Item>

        <Form.Item label={t('memberAccessLabel')} name="access">
          <Select
            options={[
              { value: 'member', label: t('memberText') },
              { value: 'admin', label: t('adminText') },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} htmlType="submit">
            {t('addToTeamButton')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddMemberDrawer;
