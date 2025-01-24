import React, { useState } from 'react';
import { DatePicker, Button, Flex } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';

const CustomDueDatePicker = ({
  dueDate,
  onDateChange,
}: {
  dueDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const handleDateChange = (date: Dayjs | null) => {
    onDateChange(date);
    setIsDatePickerOpen(false);
  };

  return dueDate ? (
    <DatePicker
      value={dueDate}
      format={'MMM DD, YYYY'}
      onChange={handleDateChange}
      variant="borderless"
      suffixIcon={null}
      style={{ textAlign: 'right', padding: 0, maxWidth: 100 }}
    />
  ) : (
    <Flex
      gap={4}
      align="center"
      style={{ position: 'relative', width: 26, height: 26 }}
    >
      <DatePicker
        open={isDatePickerOpen}
        value={dueDate}
        format={'MMM DD, YYYY'}
        onChange={handleDateChange}
        style={{ opacity: 0, width: 0, height: 0, padding: 0 }}
        popupStyle={{ paddingBlock: 12 }}
        onBlur={() => setIsDatePickerOpen(false)}
        onOpenChange={(open) => setIsDatePickerOpen(open)}
        variant="borderless"
      />
      <Button
        shape="circle"
        type="dashed"
        size="small"
        style={{
          background: 'transparent',
          boxShadow: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 26,
          height: 26,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsDatePickerOpen(true);
        }}
        icon={<CalendarOutlined />}
      />
    </Flex>
  );
};

export default CustomDueDatePicker;
