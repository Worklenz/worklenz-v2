import React, { memo, useState } from 'react';
import { ConfigProvider, Table, TableColumnsType } from 'antd';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { toggleProjectReportsDrawer } from '../../../../features/reporting/projectReports/projectReportsSlice';
import CustomTableTitle from '../../../../components/CustomTableTitle';
import { useTranslation } from 'react-i18next';
import MembersAvatarGroupCell from './MembersAvatarGroupCell';
import OverviewReportsDrawer from '../../../../features/reporting/overviewReports/overviewDrawer/OverviewReportsDrawer';
import { toggleOverviewReportsDrawer } from '../../../../features/reporting/overviewReports/overviewReportsSlice';

type ProjectReportsTableProps = {
  teamsList: any[];
};

const OverviewReportsTable = ({ teamsList }: ProjectReportsTableProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  console.log(teamsList);

  // localization
  const { t } = useTranslation('reporting-overview');

  const dispatch = useAppDispatch();

  // function to handle drawer toggle
  const handleDrawerOpen = (id: string) => {
    setSelectedId(id);
    dispatch(toggleOverviewReportsDrawer());
  };

  const columns: TableColumnsType = [
    {
      key: 'name',
      title: <CustomTableTitle title={t('nameColumn')} />,
      className: 'group-hover:text-[#1890ff]',
      dataIndex: 'name',
    },
    {
      key: 'projects',
      title: <CustomTableTitle title={t('projectsColumn')} />,
      className: 'group-hover:text-[#1890ff]',
      dataIndex: 'projects_count',
    },
    {
      key: 'members',
      title: <CustomTableTitle title={t('membersColumn')} />,
      render: (record) => (
        <MembersAvatarGroupCell membersList={record.members} />
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            cellPaddingBlock: 8,
            cellPaddingInline: 10,
          },
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={teamsList}
        scroll={{ x: 'max-content' }}
        onRow={(record) => {
          return {
            onClick: () => handleDrawerOpen(record.id),
            style: { height: 48, cursor: 'pointer' },
            className: 'group even:bg-[#4e4e4e10]',
          };
        }}
      />

      <OverviewReportsDrawer teamsId={selectedId} />
    </ConfigProvider>
  );
};

export default memo(OverviewReportsTable);
