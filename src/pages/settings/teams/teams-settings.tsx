import { Button, Card, Flex, Table, TableProps, Tooltip, Typography } from 'antd';
import PinRouteToNavbarButton from '@components/PinRouteToNavbarButton';
import { useAppSelector } from '@/hooks/useAppSelector';
import { TeamsType } from '@/types/admin-center/team.types';
import { durationDateFormat } from '@utils/durationDateFormat';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import EditTeamModal from '@features/adminCenter/teams/EditTeamModal';
import { toggleUpdateTeamNameModal } from '@features/teams/teamSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

const TeamsSettings = () => {
  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  useDocumentTitle('Teams')

  // get currently selected team id
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  // get team list from redux -> teamReducer
  const teamList = useAppSelector((state) => state.teamReducer.teamsList);
  const dispatch = useAppDispatch();

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'name',
      title: 'Name',
      render: (record: TeamsType) => (
        <Typography.Text>{record.teamName}</Typography.Text>
      ),
    },
    {
      key: 'created',
      title: 'Created',
      render: (record: TeamsType) => (
        <Typography.Text>{durationDateFormat(record.created)}</Typography.Text>
      ),
    },
    {
      key: 'ownsBy',
      title: 'Owns By',
      render: (record: TeamsType) => (
        <Typography.Text>{record.owner}</Typography.Text>
      ),
    },
    {
      key: 'actionBtns',
      width: 60,
      render: (record: TeamsType) =>
        hoverRow === record.teamId && (
          <Tooltip title="Edit" trigger={'hover'}>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedTeamId(record.teamId);
                dispatch(toggleUpdateTeamNameModal());
              }}
            />
          </Tooltip>
        ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBlockEnd: 24 }}
      >
        <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
          {teamList.length} Team
          {teamList.length !== 1 && 's'}
        </Typography.Title>

        <Tooltip
          title={'Click to pin this into the main menu'}
          trigger={'hover'}
        >
          {/* this button pin this route to navbar  */}
          <PinRouteToNavbarButton
            name="teams"
            path="/worklenz/settings/teams"
          />
        </Tooltip>
      </Flex>

      <Card style={{ width: '100%' }}>
        <Table
          className="custom-two-colors-row-table"
          columns={columns}
          dataSource={teamList}
          rowKey={(record) => record.teamId}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
          onRow={(record) => {
            return {
              onMouseEnter: () => setHoverRow(record.teamId),
              onMouseLeave: () => setHoverRow(null),
              style: {
                cursor: 'pointer',
                height: 36,
              },
            };
          }}
        />
      </Card>

      {/* edit team name modal */}
      <EditTeamModal selectedTeamId={selectedTeamId} />
    </div>
  );
};

export default TeamsSettings;
