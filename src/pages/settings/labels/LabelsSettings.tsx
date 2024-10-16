import { Card, Flex, Input, Table, TableProps, Typography } from 'antd'
import React from 'react'

import PinRouteToNavbarButton from '../../../components/PinRouteToNavbarButton'

const LabelsSettings = () => {
    // table columns
    const columns: TableProps['columns'] = [
        {
            key: 'label',
            title: 'Label',
            dataIndex: 'label',
        },
        {
            key: 'associatedTask',
            title: 'Associated Task',
            dataIndex: 'associatedTask',
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
                            placeholder="Search by name"
                            style={{ maxWidth: 200 }}
                        />

                        {/* this button pin this route to navbar  */}
                        <PinRouteToNavbarButton
                            name="labels"
                            path="/worklenz/settings/labels"
                        />
                    </Flex>
                </Flex>
            }
        >
            <Table
                locale={{
                    emptyText: (
                        <Typography.Text>
                            Labels can be created while updating or creating
                            tasks.
                        </Typography.Text>
                    ),
                }}
                columns={columns}
            />
        </Card>
    )
}

export default LabelsSettings
