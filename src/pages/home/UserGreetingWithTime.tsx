import { Flex, Typography } from 'antd';
import React from 'react';
import { colors } from '../../styles/colors';
import { greetingString } from '../../utils/greetingString';
import dayjs from 'dayjs';
import { useAppSelector } from '../../hooks/useAppSelector';

const UserGreetingWithTime = () => {
  // get user data from redux - user reducer
  const userDetails = useAppSelector((state) => state.userReducer);
  // get the first name from the user details
  const firstName = userDetails.name.split(' ');

  const date = dayjs();
  // get a greeting message based on the time
  const greet: string = greetingString(firstName[0]);

  return (
    <Flex vertical gap={8} align="center">
      <Typography.Title level={3} style={{ fontWeight: 500, marginBlock: 0, color: '#6D6D6D'}}>
        {greet}
      </Typography.Title>
      <Typography.Title
        level={4}
        style={{
          fontSize: 16,
          fontWeight: 400,
          marginBlock: 0,
          color: colors.skyBlue,
        }}
      >
        Today is {date.format('dddd, MMMM DD, YYYY')}
      </Typography.Title>
    </Flex>
  );
};

export default UserGreetingWithTime;
