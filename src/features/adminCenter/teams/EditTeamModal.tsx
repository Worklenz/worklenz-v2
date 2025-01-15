import { Divider, Form, Input, message, Modal, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { editTeamName, toggleUpdateTeamNameModal } from '../../teams/teamSlice';
import { TeamsType } from '../../../types/admin-center/team.types';

type EditTeamProps = {
  selectedTeamId: string | null;
};

const EditTeamModal = ({ selectedTeamId }: EditTeamProps) => {
  // get team list from team reducer
  const teamsList = useAppSelector((state) => state.teamReducer.teamsList);
  const isModalOpen = useAppSelector(
    (state) => state.teamReducer.isUpdateTitleNameModalOpen
  );
  // get selected team data
  const selectedTeam = teamsList.find((team) => team.teamId === selectedTeamId);

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  // Load the selected team details to the form when modal opens
  useEffect(() => {
    if (selectedTeam) {
      form.setFieldsValue({ name: selectedTeam.teamName });
    }
  }, [form, selectedTeam]);

  // function for form submition
  const handleFormSubmit = async (value: any) => {
    try {
      if (selectedTeam) {
        const updatedTeamName: TeamsType = {
          ...selectedTeam,
          teamName: value.name,
        };

        dispatch(editTeamName(updatedTeamName));
        dispatch(toggleUpdateTeamNameModal());
        message.success('Tema name changed!');
      }
    } catch (error) {
      message.error('Team name change failed!');
    }
  };

  return (
    <Modal
      title={
        <Typography.Text
          style={{
            fontWeight: 500,
            fontSize: 16,
            width: '100%',
          }}
        >
          Edit Team Name
          <Divider />
        </Typography.Text>
      }
      open={isModalOpen}
      onOk={handleFormSubmit}
      okText="Update Name"
      onCancel={() => dispatch(toggleUpdateTeamNameModal())}
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter a Name',
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTeamModal;
