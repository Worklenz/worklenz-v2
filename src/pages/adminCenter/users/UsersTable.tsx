import { Avatar, Table, TableProps } from 'antd'
import React from 'react'
import './UsersTable.css'

interface DataType {
    key: string
    user: string
    email: string
    lastActivity: string
}

const UsersTable: React.FC = () => {
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (text) => (
                <span>
                    <Avatar
                        style={{
                            width: '28px',
                            backgroundColor: '#bf4949',
                            height: '28px',
                            marginRight: '8px',
                        }}
                    >
                        {text.charAt(0).toUpperCase()}
                    </Avatar>
                    {text}
                </span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <span className="email-hover">{text}</span>,
        },
        {
            title: 'Last Activity',
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            render: (text) => <span>{text}</span>,
        },
    ]

    const data: DataType[] = [
        {
            key: '1',
            user: 'Raveesha Dilanka',
            email: 'raveeshadilanka1999@gmail.com',
            lastActivity: '-',
        },
    ]

    return (
        <Table
            rowClassName="users-table-row"
            columns={columns}
            dataSource={data}
            pagination={{
                showSizeChanger: true,
                defaultPageSize: 20,
            }}
        />
    )
}

export default UsersTable
