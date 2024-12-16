import { Drawer, Typography, Flex, Button, Dropdown } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { BankOutlined, DownOutlined } from '@ant-design/icons';
import { colors } from '../../../../styles/colors';
import { useTranslation } from 'react-i18next';

import OverviewReportsDrawerTabs from './OverviewReportsDrawerTabs';
import { toggleOverviewReportsDrawer } from '../overviewReportsSlice';

type OverviewReportsDrawerProps = {
  teamsId: string | null;
};

const OverviewReportsDrawer = ({ teamsId }: OverviewReportsDrawerProps) => {
  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  const dispatch = useAppDispatch();

  // get drawer open state and overview list from the reducer
  const isDrawerOpen = useAppSelector(
    (state) => state.overviewReportsReducer.isOverviewReportsDrawerOpen
  );
  const { teamsList } = useAppSelector((state) => state.overviewReportsReducer);

  // find the selected overview based on teamsId
  const selectedTeam = teamsList.find((team) => team.id === teamsId);

  // function to handle drawer close
  const handleClose = () => {
    dispatch(toggleOverviewReportsDrawer());
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      width={900}
      title={
        selectedTeam && (
          <Flex align="center" justify="space-between">
            <Flex gap={4} align="center" style={{ fontWeight: 500 }}>
              <BankOutlined style={{ color: colors.lightGray }} />
              <Typography.Text style={{ fontSize: 16 }}>
                {selectedTeam.name}
              </Typography.Text>
            </Flex>

            <Dropdown
              menu={{
                items: [
                  { key: '1', label: t('projectsButton') },
                  { key: '2', label: t('membersButton') },
                ],
              }}
            >
              <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                {t('exportButton')}
              </Button>
            </Dropdown>
          </Flex>
        )
      }
    >
      {selectedTeam && <OverviewReportsDrawerTabs teamsId={selectedTeam.id} />}
    </Drawer>
  );
};

export default OverviewReportsDrawer;
