import { Avatar, Badge, Button, Progress, Rate, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React from 'react'
import './ArchiveProjectList.css'
import { InboxOutlined, SettingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
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

const ArchiveProjectList: React.FC = () => {
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
            members: ['Raveesha Dilanka'],
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

export default ArchiveProjectList
