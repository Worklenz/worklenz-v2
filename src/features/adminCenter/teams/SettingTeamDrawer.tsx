import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Table,
  TableProps,
  Typography,
} from 'antd';
import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../app/store';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleSettingDrawer, updateTeam } from '../../teams/teamSlice';
import { TeamsType } from '../../../types/admin-center/team.types';
import './SettingTeamDrawer.css';
import CustomAvatar from '../../../components/CustomAvatar';

interface SettingTeamDrawerProps {
  teamId: string;
}

const SettingTeamDrawer: React.FC<SettingTeamDrawerProps> = ({ teamId }) => {
  const isSettingDrawerOpen = useAppSelector(
    (state: RootState) => state.teamReducer.isSettingDrawerOpen
  );
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const teamsLists = useAppSelector(
    (state: RootState) => state.teamReducer.teamsList
  );

  const team = teamsLists.find((team) => team.teamId === teamId);

  const handleFormSubmit = (values: any) => {
    const newTeam: TeamsType = {
      teamId: teamId,
      teamName: values.name,
      membersCount: team?.membersCount || 1,
      members: team?.members || ['Raveesha Dilanka'],
      owner: values.name,
      created: team?.created || new Date(),
      isActive: false,
    };

    dispatch(updateTeam(newTeam));
    dispatch(toggleSettingDrawer());
    form.resetFields();
    message.success('Team updated!');
  };

  const membersDataSource =
    team?.members?.map((member, index) => ({
      key: index,
      memberName: member,
    })) || [];

  const columns: TableProps['columns'] = [
    {
      title: 'User',
      key: 'user',
      render: (record: { memberName: string }) => (
        <span>
          <CustomAvatar avatarName={record.memberName} />
          <Typography.Text>{record.memberName}</Typography.Text>
        </span>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: () => (
        <div>
          <Select
            style={{ width: '150px', height: '32px' }}
            disabled
            defaultValue="owner"
            options={[{ value: 'owner', label: 'Owner' }]}
          />
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          Team Settings
        </Typography.Text>
      }
      width={550}
      open={isSettingDrawerOpen}
      onClose={() => dispatch(toggleSettingDrawer())}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          name: team?.teamName,
        }}
      >
        <Form.Item
          name="name"
          label="Team name"
          rules={[
            {
              required: true,
              message: 'Please enter a Name',
            },
          ]}
        >
          <Input placeholder="Name of the team" />
        </Form.Item>

        <Form.Item
          name="users"
          label={<span>Users {team?.members.length}</span>}
          rules={[
            {
              validator: (_, value) => {
                return membersDataSource.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error('Please add at least one user'));
              },
            },
          ]}
        >
          <Table
            className="setting-team-table"
            style={{ marginBottom: '24px' }}
            columns={columns}
            dataSource={membersDataSource}
            pagination={false}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SettingTeamDrawer;
