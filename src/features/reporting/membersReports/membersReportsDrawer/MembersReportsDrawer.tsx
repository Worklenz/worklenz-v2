import { Drawer, Typography, Flex, Button, Space, Dropdown } from 'antd';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleMembersReportsDrawer } from '../membersReportsSlice';
import { DownOutlined } from '@ant-design/icons';
import MembersReportsDrawerTabs from './MembersReportsDrawerTabs';
import { useTranslation } from 'react-i18next';
import MembersOverviewTasksStatsDrawer from './overviewTab/membersOverviewTasksStatsDrawer/MembersOverviewTasksStatsDrawer';
import MembersOverviewProjectsStatsDrawer from './overviewTab/membersOverviewProjectsStatsDrawer/MembersOverviewProjectsStatsDrawer';
import TimeWiseFilter from '@/pages/reporting/members-reports/TimeWiseFilter';

type MembersReportsDrawerProps = {
  memberId: string | null;
};

const MembersReportsDrawer = ({ memberId }: MembersReportsDrawerProps) => {
  // localization
  const { t } = useTranslation('reporting-members-drawer');

  const dispatch = useAppDispatch();

  // get drawer open state and member list from the reducer
  const isDrawerOpen = useAppSelector(
    (state) => state.membersReportsReducer.isMembersReportsDrawerOpen
  );
  const { membersList } = useAppSelector(
    (state) => state.membersReportsReducer
  );

  // find the selected member based on memberId
  const selectedMember = membersList.find((member) => member.id === memberId);

  // function to handle drawer close
  const handleClose = () => {
    dispatch(toggleMembersReportsDrawer());
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      width={900}
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
                <Button
                  type="primary"
                  icon={<DownOutlined />}
                  iconPosition="end"
                >
                  {t('exportButton')}
                </Button>
              </Dropdown>
            </Space>
          </Flex>
        )
      }
    >
      {selectedMember && (
        <MembersReportsDrawerTabs memberId={selectedMember.id} />
      )}

      {/* members overview tasks stats drawer  */}
      {selectedMember && (
        <MembersOverviewTasksStatsDrawer memberId={selectedMember.id} />
      )}
      {/* members overview projects stats drawer  */}
      {selectedMember && (
        <MembersOverviewProjectsStatsDrawer memberId={selectedMember.id} />
      )}
    </Drawer>
  );
};

export default MembersReportsDrawer;
