import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Button, Drawer, Form, Input, message, Typography } from 'antd';
import { TeamsType } from '../../../types/admin-center/team.types';
import { nanoid } from '@reduxjs/toolkit';
import { addTeam, toggleDrawer } from '../../teams/teamSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';

const CreateTeamDrawer: React.FC = () => {
  const isDrawerOpen = useSelector(
    (state: RootState) => state.teamReducer.isDrawerOpen
  );
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { t } = useTranslation('teams');

  const handleFormSubmit = (values: any) => {
    const newTeam: TeamsType = {
      teamId: nanoid(),
      teamName: values.name,
      membersCount: 1,
      members: ['Raveesha Dilanka'],
      owner: values.name,
      created: new Date(),
      isActive: false,
    };

    dispatch(addTeam(newTeam));
    dispatch(toggleDrawer());
    form.resetFields();
    message.success('Team added!');
  };

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          {t('drawerTitle')}
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleDrawer())}
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          name="name"
          label={t('label')}
          rules={[
            {
              required: true,
              message: t('message'),
            },
          ]}
        >
          <Input placeholder={t('drawerPlaceholder')} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} htmlType="submit">
            {t('create')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateTeamDrawer;
