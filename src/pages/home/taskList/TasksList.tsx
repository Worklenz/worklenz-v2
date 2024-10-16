import { SyncOutlined } from '@ant-design/icons'
import {
    Badge,
    Button,
    Card,
    Flex,
    Segmented,
    Select,
    Skeleton,
    Table,
    TableProps,
    Tooltip,
    Typography,
} from 'antd'
import React, { useState } from 'react'
import ListView from './ListView'
import CalendarView from './CalendarView'
import { useAppSelector } from '../../../hooks/useAppSelector'
import EmptyListPlaceholder from '../../../components/EmptyListPlaceholder'
import StatusDropdown from './statusDropdown/StatusDropdown'
import { TaskType } from '../../../types/task.types'

const TasksList = () => {
    const tasksList = useAppSelector((state) => state.taskReducer.tasks)
    const projectList = useAppSelector(
        (state) => state.projectReducer.projectsList
    )
    const [listView, setListView] = useState<'List' | 'Calendar'>('List')
    const [isLoading, setIsLoading] = useState(false)

    // function for handle refresh
    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
    }

    // function for handle segmaent change and render the calender
    const handleSegmentChange = (value: 'List' | 'Calendar') => {
        if (value === 'Calendar') {
            setListView('Calendar')
            handleRefresh()
        } else {
            setListView('List')
            handleRefresh()
        }
    }

    // table columns
    const columns: TableProps<TaskType>['columns'] = [
        {
            key: 'task',
            title: 'Task',
            width: '400px',
            render: (values) => (
                <Typography.Text style={{ textTransform: 'capitalize' }}>
                    {values.task}
                </Typography.Text>
            ),
        },
        {
            key: 'project',
            title: 'Project',
            width: '180px',
            render: (values) => {
                const project = projectList.find(
                    (project) => project.projectName === values.project
                )
                return (
                    project && (
                        <Typography.Paragraph
                            style={{ margin: 0, paddingInlineEnd: 6 }}
                        >
                            <Badge
                                color={project.projectColor}
                                style={{ marginInlineEnd: 4 }}
                            />
                            {project.projectName}
                        </Typography.Paragraph>
                    )
                )
            },
        },
        {
            key: 'status',
            title: 'Status',
            width: '180px',
            render: (values) => (
                <StatusDropdown currentStatus={values.status} />
            ),
        },
        {
            key: 'dueDate',
            title: 'Due Date',
            width: '180px',
            dataIndex: 'dueDate',
        },
    ]

    return (
        <Card
            title={
                <Flex gap={8} align="center">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Tasks
                    </Typography.Title>
                    <Select
                        defaultValue="assigned to me"
                        options={[
                            {
                                value: 'assigned to me',
                                label: 'assigned to me',
                            },
                            {
                                value: 'assigned by me',
                                label: 'assigned by me',
                            },
                        ]}
                    />
                </Flex>
            }
            extra={
                <Flex gap={8} align="center">
                    <Tooltip title={'Refresh'} trigger={'hover'}>
                        <Button
                            shape="circle"
                            icon={<SyncOutlined spin={isLoading} />}
                            onClick={() => handleRefresh()}
                        />
                    </Tooltip>
                    <Segmented<'List' | 'Calendar'>
                        options={['List', 'Calendar']}
                        defaultValue="List"
                        onChange={(value: 'List' | 'Calendar') =>
                            handleSegmentChange(value)
                        }
                    />
                </Flex>
            }
            style={{ width: '100%' }}
        >
            {/* toggle task view list / calendar */}
            {listView === 'List' ? <ListView /> : <CalendarView />}

            {/* task list table --> render with different filters and views  */}
            {isLoading ? (
                <Skeleton />
            ) : tasksList.length === 0 ? (
                <EmptyListPlaceholder
                    imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
                    text=" No tasks to show."
                />
            ) : (
                <Table
                    className="homepage-table"
                    dataSource={tasksList}
                    rowKey={(record) => record.taskId}
                    columns={columns}
                    pagination={false}
                />
            )}
        </Card>
    )
}

export default TasksList
