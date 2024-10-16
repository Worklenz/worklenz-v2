import { Table } from 'antd'
import React from 'react'
import './AllProjectList.css'
import TableColumns from '../TableColumns'

interface DataType {
    key: string
    name: string
    client: string
    category: string
    status: string
    totalTasks: number
    completedTasks: number
    lastUpdated: Date
    startDate: Date | null
    endDate: Date | null
    members: string[]
}

const AllProjectList: React.FC = () => {
    const data: DataType[] = [
        {
            key: '1',
            name: 'Worklenze UI rebuild',
            client: '-',
            category: 'Test',
            status: 'Proposed',
            totalTasks: 10,
            completedTasks: 6,
            lastUpdated: new Date('2024-10-08T08:30:00'),
            startDate: null,
            endDate: null,
            members: [
                'Chathuranga Pathum',
                'Chamika Jayasri',
                'Raveesha Dilanka',
                'Sachintha Prasad',
            ],
        },
        {
            key: '2',
            name: 'test',
            client: '-',
            category: '-',
            status: 'Proposed',
            totalTasks: 100,
            completedTasks: 6,
            lastUpdated: new Date('2024-05-08T08:30:00'),
            startDate: new Date('2024-05-08T08:30:00'),
            endDate: new Date('2024-12-08T08:30:00'),
            members: ['Raveesha Dilanka', 'Sachintha Prasad'],
        },
    ]

    return (
        <Table
            columns={TableColumns()}
            dataSource={data}
            className="custom-table"
            rowClassName={() => 'custom-row'}
            pagination={{
                showSizeChanger: true,
                defaultPageSize: 20,
            }}
        />
    )
}

export default AllProjectList
