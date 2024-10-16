import { Badge, Card, Dropdown, Flex, Menu, MenuProps } from 'antd'
import React, { useState } from 'react'
import { colors } from '../../../../styles/colors'
import { DownOutlined } from '@ant-design/icons'
import { TaskStatusType } from '../../../../types/task.types'
// custom css file
import './statusDropdown.css'

type StatusDropdownProps = {
    currentStatus: TaskStatusType
}

const StatusDropdown = ({ currentStatus }: StatusDropdownProps) => {
    const [status, setStatus] = useState<TaskStatusType>(currentStatus)

    // fuction for get a color regariding the status
    const getStatuColor = (status: TaskStatusType) => {
        if (status === 'Todo') return colors.deepLightGray
        else if (status === 'Doing') return colors.midBlue
        else return colors.lightGreen
    }

    // menu type
    type MenuItem = Required<MenuProps>['items'][number]
    // status menu item
    const statusMenuItems: MenuItem[] = [
        {
            key: 'Todo',
            label: (
                <Flex gap={4}>
                    <Badge color={getStatuColor('Todo')} /> Todo
                </Flex>
            ),
        },
        {
            key: 'Doing',
            label: (
                <Flex gap={4}>
                    <Badge color={getStatuColor('Doing')} /> Doing
                </Flex>
            ),
        },
        {
            key: 'Done',
            label: (
                <Flex gap={4}>
                    <Badge color={getStatuColor('Done')} /> Done
                </Flex>
            ),
        },
    ]

    // handle status select
    const onClick: MenuProps['onClick'] = (e) => {
        e.key === 'Todo'
            ? setStatus('Todo')
            : e.key === 'Doing'
              ? setStatus('Doing')
              : setStatus('Done')
    }

    //dropdown items
    const statusDropdownItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Card className="status-dropdown-card" bordered={false}>
                    <Menu
                        className="status-menu"
                        items={statusMenuItems}
                        defaultValue={'Todo'}
                        onClick={onClick}
                    />
                </Card>
            ),
        },
    ]

    return (
        <Dropdown
            overlayClassName="status-dropdown"
            menu={{ items: statusDropdownItems }}
            placement="bottomRight"
            trigger={['click']}
        >
            <Flex
                gap={4}
                style={{
                    width: 'fit-content',
                    borderRadius: 24,
                    padding: '2px 12px',
                    fontSize: 13,
                    backgroundColor: getStatuColor(status),
                }}
            >
                {status}
                <DownOutlined />
            </Flex>
        </Dropdown>
    )
}

export default StatusDropdown
