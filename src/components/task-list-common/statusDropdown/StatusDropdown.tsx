import { Badge, Flex, Select, Typography } from 'antd';
import { useState } from 'react';
import './statusDropdown.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '../../../utils/getStatusColor';

type StatusDropdownProps = {
  currentStatus: string;
};

const StatusDropdown = ({ currentStatus }: StatusDropdownProps) => {
  const [status, setStatus] = useState<string>(currentStatus);

  // localization
  const { t } = useTranslation('task-list-table');

  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const statusList = useAppSelector((state) => state.statusReducer.status);

  const handleStatusChange = (value: string) => {
    const selectedOption = statusList.find((el) => el.id === value);
    if (selectedOption) {
      setStatus(selectedOption.category);
    }
  };

  return (
    <Select
      value={status}
      onChange={handleStatusChange}
      style={{ width: 120 }}
      dropdownStyle={{ borderRadius: 8 }}
      options={statusList.map((status) => ({
        value: status.id,
        label: (
          <Flex gap={8} align="center">
            <Badge color={getStatusColor(status.category, themeMode)} />
            <Typography.Text>
              {status.name}
            </Typography.Text>
          </Flex>
        ),
      }))}
    />
  );
};

export default StatusDropdown;
