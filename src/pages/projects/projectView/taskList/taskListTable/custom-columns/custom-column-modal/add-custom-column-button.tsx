import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import CustomColumnModal from './custom-column-modal';
const AddCustomColumnButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //   function to open modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  //   fuction to handle cancel
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title={'Add a custom column'}>
        <Button
          icon={<PlusOutlined />}
          style={{
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
          onClick={handleModalOpen}
        />
      </Tooltip>

      <CustomColumnModal
        modalType="create"
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default AddCustomColumnButton;
