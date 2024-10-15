import { PushpinOutlined } from '@ant-design/icons'
import {
    Button,
    Card,
    Flex,
    Table,
    TableProps,
    Tooltip,
    Typography,
} from 'antd'
import { colors } from '../../../styles/colors'
import PinRouteToNavbarButton from '../../../components/PinRouteToNavbarButton'

const TeamsSettings = () => {
    // table columns
    const columns: TableProps['columns'] = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
        },
        {
            key: 'created',
            title: 'Created',
            dataIndex: 'created',
        },
        {
            key: 'ownsBy',
            title: 'Owns By',
            dataIndex: 'ownsBy',
        },
    ]

    return (
        <div style={{ width: '100%' }}>
            <Flex
                align="center"
                justify="space-between"
                style={{ marginBlockEnd: 24 }}
            >
                <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
                    0 Teams
                </Typography.Title>

                {/* this button pin this route to navbar  */}
                <PinRouteToNavbarButton
                    name="teams"
                    path="/worklenz/settings/teams"
                />
            </Flex>

            <Card style={{ width: '100%' }}>
                <Table columns={columns} />
            </Card>
        </div>
    )
}

export default TeamsSettings
