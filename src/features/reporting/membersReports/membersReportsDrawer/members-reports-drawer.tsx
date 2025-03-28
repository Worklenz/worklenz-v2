import { Drawer, Typography, Flex, Button, Space, Dropdown } from 'antd';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleMembersReportsDrawer } from '../membersReportsSlice';
import { DownOutlined } from '@ant-design/icons';
import MembersReportsDrawerTabs from './members-reports-drawer-tabs';
import { useTranslation } from 'react-i18next';
import MembersOverviewTasksStatsDrawer from './overviewTab/members-overview-tasks-stats-drawer/members-overview-tasks-stats-drawer';
import MembersOverviewProjectsStatsDrawer from './overviewTab/members-overview-projects-stats-drawer/members-overview-projects-stats-drawer';
import TimeWiseFilter from '@/components/reporting/time-wise-filter';

type MembersReportsDrawerProps = {
  memberId: string | null;
};

const MembersReportsDrawer = ({ memberId }: MembersReportsDrawerProps) => {
  const { t } = useTranslation('reporting-members-drawer');

  const dispatch = useAppDispatch();

  const isDrawerOpen = useAppSelector(state => state.membersReportsReducer.isMembersReportsDrawerOpen);
  const { membersList } = useAppSelector(state => state.membersReportsReducer);

  const selectedMember = membersList?.find(member => member.id === memberId);

  const handleClose = () => {
    dispatch(toggleMembersReportsDrawer());
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      width={900}
      destroyOnClose
      title={
        selectedMember && (
          <Flex align="center" justify="space-between">
            <Flex gap={8} align="center" style={{ fontWeight: 500 }}>
              <Typography.Text>{selectedMember.name}</Typography.Text>
            </Flex>

            <Space>
              <TimeWiseFilter />
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: t('timeLogsButton') },
                    { key: '2', label: t('activityLogsButton') },
                    { key: '3', label: t('tasksButton') },
                  ],
                }}
              >
                <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                  {t('exportButton')}
                </Button>
              </Dropdown>
            </Space>
          </Flex>
        )
      }
    >
      {selectedMember && <MembersReportsDrawerTabs memberId={selectedMember.id} />}
      {selectedMember && <MembersOverviewTasksStatsDrawer memberId={selectedMember.id} />}
      {selectedMember && <MembersOverviewProjectsStatsDrawer memberId={selectedMember.id} />}
    </Drawer>
  );
};

export default MembersReportsDrawer;
