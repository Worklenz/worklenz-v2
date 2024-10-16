import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-components'
import { Button, Card, Flex, Input, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import UsersTable from './UsersTable'
import { RootState } from '../../../app/store'
import { useAppSelector } from '../../../hooks/useAppSelector'

const Users: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)

    const themeMode = useAppSelector(
        (state: RootState) => state.themeReducer.mode
    )

    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedTerm, setDebouncedTerm] = useState('')

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    useEffect(() => {
        if (debouncedTerm) {
            performSearch(debouncedTerm)
        }
    }, [debouncedTerm])

    const performSearch = (query: string) => {
        console.log('Searching for:', query)
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
    }

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title={<span>Users</span>}
                style={{ padding: '16px 0' }}
            />
            <PageHeader
                style={{
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingRight: '24px',
                    paddingBottom: '16px',
                }}
                subTitle={
                    <span
                        style={{
                            color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                            fontWeight: 500,
                            fontSize: '16px',
                        }}
                    >
                        1 users
                    </span>
                }
                extra={
                    <Flex gap={8} align="center">
                        <Tooltip title="Refresh users">
                            <Button
                                shape="circle"
                                icon={<SyncOutlined spin={isLoading} />}
                                onClick={() => handleRefresh()}
                            />
                        </Tooltip>
                        <Input
                            placeholder="Search by name"
                            suffix={<SearchOutlined />}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Flex>
                }
            />
            <Card>
                <UsersTable />
            </Card>
        </div>
    )
}

export default Users
