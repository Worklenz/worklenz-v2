import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Tooltip } from 'antd';
import React, { useState } from 'react';
import { colors } from '@/styles/colors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { IMyTask } from '@/types/home/my-tasks.types';

type TodoDoneButtonProps = {
  record: IMyTask;
};

const TodoDoneButton = ({ record }: TodoDoneButtonProps) => {
  const [checkIconColor, setCheckIconColor] = useState<string>(
    colors.lightGray
  );

  const handleCompleteTodo = () => {
    setCheckIconColor(colors.limeGreen);

    setTimeout(() => {
      setCheckIconColor(colors.lightGray);
    }, 500);
  };

  return (
    <ConfigProvider wave={{ disabled: true }}>
      <Tooltip title={'Mark as done'}>
        <Button
          type='text'
          className="borderless-icon-btn"
          style={{ backgroundColor: colors.transparent }}
          shape="circle"
          icon={<CheckCircleOutlined style={{ color: checkIconColor }} />}
          onClick={handleCompleteTodo}
        />
      </Tooltip>
    </ConfigProvider>
  );
};

export default TodoDoneButton;
