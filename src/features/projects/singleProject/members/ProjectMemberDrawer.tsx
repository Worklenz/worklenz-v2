import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Flex,
  Form,
  Input,
  List,
  Select,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import {
  addProjectMember,
  toggleProjectMemberDrawer,
} from './projectMembersSlice';
import { colors } from '../../../../styles/colors';
import CustomAvatar from '../../../../components/CustomAvatar';
import { ProjectMemberType } from '../../../../types/projectMember.types';
import { nanoid } from '@reduxjs/toolkit';
// import { MemberType } from '../../../../types/member.types';
// import { nanoid } from '@reduxjs/toolkit';

const ProjectMemberDrawer = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // get member list from global members slice where which is updated with navbar invite button
  const allMembersList = [
    ...useAppSelector((state) => state.memberReducer.membersList),
    useAppSelector((state) => state.memberReducer.owner),
  ];

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // get drawer state from project member reducer
  const isDrawerOpen = useAppSelector(
    (state) => state.projectMemberReducer.isDrawerOpen
  );

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const filteredMembersList = allMembersList.filter((member) =>
    member.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // this function for handle form submit
  const handleFormSubmit = async (values: any) => {
    try {
      const newMember: ProjectMemberType = {
        memberId: nanoid(),
        memberName: values.name,
        memberEmail: values.email,
        memberRole: 'member',
        completedTasks: 0,
        totalAssignedTasks: 0,
      };
      dispatch(addProjectMember(newMember));
      dispatch(toggleProjectMemberDrawer());
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  // custom dropdown content
  const memberDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 0 } }}>
      <List style={{ padding: 0 }}>
        {filteredMembersList.map((member) => (
          <List.Item
            className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
            key={member.memberId}
            style={{
              display: 'flex',
              gap: 8,
              padding: '4px 8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Flex gap={8} align="center">
              <CustomAvatar avatarName={member.memberName} />
              <Flex vertical>
                <Typography.Text
                  style={{
                    textTransform: 'capitalize',
                  }}
                >
                  {member.memberName}
                </Typography.Text>

                <Typography.Text
                  style={{
                    fontSize: 14,
                    color: colors.lightGray,
                  }}
                >
                  {member?.memberEmail}
                </Typography.Text>
              </Flex>
            </Flex>
          </List.Item>
        ))}
      </List>
    </Card>
  );

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          Project Members
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleProjectMemberDrawer())}
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          name="memberName"
          label="Add members by adding their name or email"
        >
          <Dropdown
            overlayClassName="custom-dropdown"
            trigger={['click']}
            dropdownRender={() => memberDropdownContent}
          >
            <Input
              placeholder="Type name or email"
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </Dropdown>
        </Form.Item>
      </Form>

      <Flex
        vertical
        gap={8}
        style={{ border: '1px solid gray', borderRadius: 8 }}
        className="divide-y-[1px]"
      >
        {allMembersList.map((member) => (
          <Flex gap={8} align="center" style={{ padding: 8 }}>
            <CustomAvatar avatarName={member.memberName} />
            <Flex vertical>
              <Typography.Text
                style={{
                  textTransform: 'capitalize',
                }}
              >
                {member.memberName}
              </Typography.Text>

              <Typography.Text
                style={{
                  fontSize: 14,
                  color: colors.lightGray,
                }}
              >
                {member?.memberEmail}
              </Typography.Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Drawer>
  );
};

export default ProjectMemberDrawer;
