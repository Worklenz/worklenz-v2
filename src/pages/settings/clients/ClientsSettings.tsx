import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
} from '@ant-design/icons'
import {
    Button,
    Card,
    Flex,
    Input,
    Popconfirm,
    Table,
    TableProps,
    Typography,
} from 'antd'
import React, { useMemo, useState } from 'react'
import { colors } from '../../../styles/colors'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import {
    deleteClient,
    toggleCreateClientDrawer,
    toggleUpdateClientDrawer,
} from '../../../features/settings/client/clientSlice'
import CreateClientDrawer from '../../../features/settings/client/CreateClientDrawer'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ClientType } from '../../../types/client'

import PinRouteToNavbarButton from '../../../components/PinRouteToNavbarButton'
import UpdateClientDrawer from '../../../features/settings/client/UpdateClientDrawer'

const ClientsSettings = () => {
    // get currently hover row
    const [hoverRow, setHoverRow] = useState<string | null>(null)
    // get currently selected client id
    const [selectedClientId, setSelectedClientId] = useState<string | null>(
        null
    )

    // get data from client reducer
    const clientsList = useAppSelector(
        (state) => state.clientReducer.clientsList
    )
    const dispatch = useAppDispatch()

    // this is for get the current string that type on search bar
    const [searchQuery, setSearchQuery] = useState<string>('')

    // used useMemo hook for re render the list when searching
    const filteredClientsData = useMemo(() => {
        return clientsList.filter((item) =>
            item.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [clientsList, searchQuery])

    // table columns
    const columns: TableProps['columns'] = [
        {
            key: 'clientName',
            title: 'Name',
            sorter: (a, b) => a.clientName.localeCompare(b.clientName),
            render: (record: ClientType) => (
                <Typography.Text
                    style={{
                        color:
                            hoverRow === record.clientId
                                ? colors.skyBlue
                                : colors.darkGray,
                    }}
                    onClick={() => {
                        setSelectedClientId(record.clientId)
                        dispatch(toggleUpdateClientDrawer())
                    }}
                >
                    {record.clientName}
                </Typography.Text>
            ),
        },
        {
            key: 'project',
            title: 'Project',
            render: (record: ClientType) =>
                record.project ? (
                    <Typography.Text>{record.project}</Typography.Text>
                ) : (
                    <Typography.Text style={{ color: colors.lightGray }}>
                        No projects available
                    </Typography.Text>
                ),
        },
        {
            key: 'actionBtns',
            width: 80,
            render: (record: ClientType) =>
                hoverRow === record.clientId && (
                    <Flex gap={8} style={{ padding: 0 }}>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedClientId(record.clientId)
                                dispatch(toggleUpdateClientDrawer())
                            }}
                        />

                        <Popconfirm
                            title="Are you sure?"
                            icon={
                                <ExclamationCircleFilled
                                    style={{ color: colors.vibrantOrange }}
                                />
                            }
                            okText="Yes"
                            cancelText="Cancel"
                            onConfirm={() =>
                                dispatch(deleteClient(record.clientId))
                            }
                        >
                            <Button
                                shape="default"
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Popconfirm>
                    </Flex>
                ),
        },
    ]

    return (
        <Card
            style={{ width: '100%' }}
            title={
                <Flex justify="flex-end">
                    <Flex
                        gap={8}
                        align="center"
                        justify="flex-end"
                        style={{ width: '100%', maxWidth: 400 }}
                    >
                        <Input.Search
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.currentTarget.value)
                            }
                            placeholder="Search by name"
                            style={{ maxWidth: 200 }}
                        />
                        <Button
                            type="primary"
                            onClick={() => dispatch(toggleCreateClientDrawer())}
                        >
                            Create Client
                        </Button>

                        {/* this button pin this route to navbar  */}
                        <PinRouteToNavbarButton
                            name="clients"
                            path="/worklenz/settings/clients"
                        />
                    </Flex>
                </Flex>
            }
        >
            <Table
                className="homepage-table"
                dataSource={filteredClientsData}
                columns={columns}
                rowKey={(record) => record.clientId}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 20,
                }}
                onRow={(record) => {
                    return {
                        onMouseEnter: () => setHoverRow(record.clientId),
                        onMouseLeave: () => setHoverRow(null),
                        style: {
                            cursor: 'pointer',
                            height: 36,
                        },
                    }
                }}
            />

            {/*  client drawers  */}
            <CreateClientDrawer />
            <UpdateClientDrawer selectedClientId={selectedClientId} />
        </Card>
    )
}

export default ClientsSettings
