import { Table } from 'antd';
import React from 'react';
import './FavouriteProjectList.css';
import TableColumns from '../TableColumns';

interface DataType {
  key: string;
  name: string;
  client: string;
  category: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  lastUpdated: Date;
  startDate: Date | null;
  endDate: Date | null;
  members: string[];
}

const FavouriteProjectList: React.FC = () => {
  const data: DataType[] = [
    {
      key: '1',
      name: 'Worklenze UI rebuild',
      client: '-',
      category: '-',
      status: 'Proposed',
      totalTasks: 10,
      completedTasks: 6,
      lastUpdated: new Date('2024-09-08T08:30:00'),
      startDate: null,
      endDate: null,
      members: ['Chathuranga Pathum', 'Chamika Jayasri', 'Raveesha Dilanka'],
    },
  ];
  return (
    <Table
      columns={TableColumns()}
      dataSource={data}
      className="custom-two-colors-row-table"
      rowClassName={() => 'custom-row'}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 20,
        pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
        size: 'small',
      }}
    />
  );
};

export default FavouriteProjectList;
