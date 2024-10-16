import {
    DeleteOutlined,
    SearchOutlined,
    SettingOutlined,
    SyncOutlined,
} from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-components'
import {
    Avatar,
    Badge,
    Button,
    Card,
    Flex,
    Input,
    Popconfirm,
    Table,
    TableProps,
    Tooltip,
    Typography,
} from 'antd'
import React, { useMemo, useState } from 'react'
import {
    deleteTeam,
    toggleDrawer,
    toggleSettingDrawer,
} from '../../../features/adminCenter/teams/teamSlice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import CreateTeamDrawer from '../../../features/adminCenter/teams/CreateTeamDrawer'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { RootState } from '../../../app/store'
import { TeamsType } from '../../../types/adminCenter/team.types'
import './Teams.css'
import SettingTeamDrawer from '../../../features/adminCenter/teams/SettingTeamDrawer'

const Teams: React.FC = () => {
    const themeMode = useAppSelector(
        (state: RootState) => state.themeReducer.mode
    )
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const teamsLists = useAppSelector(
        (state: RootState) => state.teamReducer.teamsList
    )
    const dispatch = useAppDispatch()
    const [selectedTeam, setSelectedTeam] = useState<string>('')

    const filteredTeamsData = useMemo(() => {
        return teamsLists.filter((item) =>
            item.teamName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [teamsLists, searchTerm])

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
    }

    const columns: TableProps['columns'] = [
        {
            title: 'Team',
            key: 'teamName',
            render: (record: TeamsType) => (
                <Typography.Text>
                    <Badge status="success" style={{ marginRight: '8px' }} />
                    {record.teamName}
                </Typography.Text>
            ),
        },
        {
            title: (
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                    Members Count
                </span>
            ),
            key: 'membersCount',
            render: (record: TeamsType) => (
                <Typography.Text
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    {record.membersCount.toString()}
                </Typography.Text>
            ),
        },
        {
            title: 'Members',
            key: 'members',
            render: (record: TeamsType) => (
                <span>
                    <Avatar
                        style={{
                            width: '28px',
                            backgroundColor: '#bf4949',
                            height: '28px',
                            marginRight: '8px',
                        }}
                    >
                        {record.members[0].charAt(0).toUpperCase()}
                    </Avatar>
                </span>
            ),
        },
        {
            title: '',
            key: 'button',
            render: (record: TeamsType) => (
                <div className="row-buttons">
                    <Tooltip title="Settings">
                        <Button
                            style={{ marginRight: '8px' }}
                            size="small"
                            onClick={() => {
                                setSelectedTeam(record.teamId)
                                dispatch(toggleSettingDrawer())
                            }}
                        >
                            <SettingOutlined />
                        </Button>
                    </Tooltip>
                    <SettingTeamDrawer teamId={selectedTeam} />

                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure?"
                            onConfirm={() =>
                                dispatch(deleteTeam(record.teamId))
                            }
                        >
                            <Button size="small">
                                <DeleteOutlined />
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ]

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title={<span>Teams</span>}
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
                        {teamsLists.length} teams
                    </span>
                }
                extra={
                    <Flex gap={8} align="center">
                        <Tooltip title="Refresh teams">
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
                        <Button
                            type="primary"
                            onClick={() => dispatch(toggleDrawer())}
                        >
                            Add Team
                        </Button>
                        <CreateTeamDrawer />
                    </Flex>
                }
            />

            <Card>
                <Table
                    rowClassName="team-table-row"
                    className="team-table"
                    columns={columns}
                    dataSource={filteredTeamsData}
                    rowKey={(record) => record.teamId}
                    pagination={{
                        showSizeChanger: true,
                        defaultPageSize: 20,
                    }}
                />
            </Card>
        </div>
    )
}

export default Teams
