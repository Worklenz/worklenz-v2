import { Drawer, Flex, Form, Select, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import {
  addProjectMember,
  toggleProjectMemberDrawer,
} from './projectMembersSlice';
import { colors } from '../../../../styles/colors';
import CustomAvatar from '../../../../components/CustomAvatar';
import { nanoid } from '@reduxjs/toolkit';
// import { MemberType } from '../../../../types/member.types';
// import { nanoid } from '@reduxjs/toolkit';

const ProjectMemberDrawer = () => {
  // get member list from global members slice where which is updated with navbar invite button
  const allMembersList = [
    ...useAppSelector((state) => state.memberReducer.membersList),
    useAppSelector((state) => state.memberReducer.owner),
  ];

  // get drawer state from project member reducer
  const isDrawerOpen = useAppSelector(
    (state) => state.projectMemberReducer.isDrawerOpen
  );

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  // this function for handle form submit
  const handleFormSubmit = async (values: any) => {
    try {
      const newMember: any = {
        memberId: nanoid(),
        memberName: values.name,
        memberEmail: values.email,
        memberRole: 'member',
        completedTasks: 0,
        totalAssignedTasks: 0,
      };
      dispatch(toggleProjectMemberDrawer());
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

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
          <Select
            placeholder="Type name or email"
            showSearch
            onSearch={onSearch}
            onChange={onChange}
            options={allMembersList.map((member) => ({
              key: member.memberId,
              value: member.memberName,
              label: (
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
              ),
            }))}
            suffixIcon={false}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProjectMemberDrawer;
