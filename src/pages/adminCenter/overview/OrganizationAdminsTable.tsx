import { Table, TableProps } from 'antd'
import React from 'react'
import './OrganizationAdminsTable.css'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { RootState } from '../../../app/store'

interface DataType {
    key: string
    name: string
    email: string
}

const OrganizationAdminsTable: React.FC = () => {
    const themeMode = useAppSelector(
        (state: RootState) => state.themeReducer.mode
    )

    const columns: TableProps<DataType>['columns'] = [
        {
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <div
                    style={{
                        color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                    }}
                >
                    {text}{' '}
                    <span
                        style={{
                            color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000a6'}`,
                        }}
                    >
                        (Owner)
                    </span>
                </div>
            ),
        },
        {
            dataIndex: 'email',
            key: 'email',
            render: (text) => (
                <span
                    style={{
                        color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                    }}
                >
                    {text}
                </span>
            ),
        },
    ]

    const data: DataType[] = [
        {
            key: '1',
            name: 'Raveesha Dilanka',
            email: 'raveeshadilanka1999@gmail.com',
        },
    ]
    return (
        <Table<DataType>
            className="organization-admins-table"
            columns={columns}
            dataSource={data}
        />
    )
}

export default OrganizationAdminsTable
