import {
  BankOutlined,
  CaretDownFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import { Card, Dropdown, Flex, Tooltip, Typography } from 'antd';
import React from 'react';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';
// custom css
import './switchTeam.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setTeamActive } from '../../adminCenter/teams/teamSlice';
import CustomAvatar from '../../../components/CustomAvatar';

const SwitchTeamButton = () => {
  // localization
  const { t } = useTranslation('navbar');
  // get team data from team reducer
  const teamsDetails = useAppSelector((state) => state.teamReducer.teamsList);

  // get the active team
  const activeTeam = teamsDetails.find((team) => team.isActive);
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const dispatch = useAppDispatch();

  // switch teams dropdown items
  const items = [
    ...teamsDetails.map((team) => ({
      key: team.teamId,
      label: (
        <Card
          className="switch-team-card"
          onClick={() => dispatch(setTeamActive(team.teamId))}
          bordered={false}
          style={{
            width: 230,
          }}
        >
          <Flex vertical gap={8}>
            <Flex
              gap={12}
              align="center"
              justify="space-between"
              style={{ padding: 12 }}
            >
              <Flex gap={8} align="center">
                <CustomAvatar avatarName={team.teamName} />
                <Flex vertical>
                  <Typography.Text
                    style={{
                      fontSize: 12,
                      fontWeight: 300,
                      color: colors.lightGray,
                    }}
                  >
                    Owned by {team.owner.split(' ')[0]}
                  </Typography.Text>
                  <Typography.Text>{team.teamName}</Typography.Text>
                </Flex>
              </Flex>
              <CheckCircleFilled
                style={{
                  fontSize: 16,
                  color: team.isActive ? colors.limeGreen : colors.lightGray,
                }}
              />
            </Flex>
          </Flex>
        </Card>
      ),
    })),
  ];

  return (
    <Tooltip title={t('switchTeamTooltip')} trigger={'hover'}>
      <Dropdown
        overlayClassName="switch-team-dropdown"
        menu={{ items }}
        trigger={['click']}
      >
        <Flex
          gap={12}
          align="center"
          justify="center"
          style={{
            color: themeMode === 'dark' ? '#e6f7ff' : colors.skyBlue,
            backgroundColor: themeMode === 'dark' ? '#153450' : colors.paleBlue,
            fontWeight: 500,
            borderRadius: '50rem',
            padding: '10px 16px',
            height: '39px',
          }}
        >
          <BankOutlined />
          <Typography.Text strong style={{ color: themeMode === 'dark' ? '#e6f7ff' : colors.skyBlue }}>
            {activeTeam?.teamName}
          </Typography.Text>
          <CaretDownFilled />
        </Flex>
      </Dropdown>
    </Tooltip>
  );
};

export default SwitchTeamButton;
