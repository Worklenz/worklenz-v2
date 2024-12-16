import {
  Button,
  Col,
  Flex,
  Form,
  Popconfirm,
  Row,
  Select,
  Table,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { DependencyType } from '../../../../../types/dependencies.types';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { colors } from '../../../../../styles/colors';

const DependenciesTable = () => {
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [isDependencyInputShow, setIsDependencyInputShow] =
    useState<boolean>(false);

  // state to hold dependency list
  const [dependencyList, setDependencyList] = useState<DependencyType[]>([]);

  // get task data from task reducer
  const taskList = useAppSelector((state) => state.taskReducer.tasks);

  // handle adding a new dependency
  const handleAddDependency = (taskId: string) => {
    // find the selected task from task-list
    const selectedTask = taskList.find((task) => task.taskId === taskId);

    if (!selectedTask) return;

    // create a new dependency with default values
    const newDependency: DependencyType = {
      dependencyId: nanoid(),
      taskId: selectedTask.taskId,
      task: selectedTask.task,
      blockedBy: 'blockedBy',
    };

    // update the dependency list
    setDependencyList([...dependencyList, newDependency]);
    setIsDependencyInputShow(false);
  };

  // table columns
  const columns: TableProps<DependencyType>['columns'] = [
    {
      key: 'name',
      render: (record) => (
        <Typography.Text>
          {record.task}
          <Tag style={{ marginInlineStart: 4 }}>{record.taskId}</Tag>
        </Typography.Text>
      ),
    },
    {
      key: 'blockedBy',
      render: (record) => (
        <Select
          value={record.blockedBy}
          options={[
            { key: 'blockedBy', value: 'blockedBy', label: 'Blocked By' },
          ]}
          size="small"
          onChange={(value) => {
            // update the "blockedBy" field in the dependency list
            const updatedList = dependencyList.map((item) =>
              item.dependencyId === record.dependencyId
                ? { ...item, blockedBy: value }
                : item
            );
            setDependencyList(updatedList);
          }}
        />
      ),
    },
    {
      key: 'actionBtns',
      width: 60,
      render: (record: DependencyType) =>
        hoverRow === record.dependencyId && (
          <Popconfirm
            title={'Are you sure?'}
            icon={
              <ExclamationCircleFilled
                style={{ color: colors.vibrantOrange }}
              />
            }
            okText={'Ok'}
            cancelText={'Cancel'}
            onConfirm={() =>
              setDependencyList(
                dependencyList.filter(
                  (item) => item.dependencyId !== record.dependencyId
                )
              )
            }
          >
            <Button shape="default" icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        ),
    },
  ];

  return (
    <Flex vertical gap={6}>
      {dependencyList.length > 0 && (
        <Table
          className="custom-two-colors-row-table"
          showHeader={false}
          dataSource={dependencyList}
          columns={columns}
          rowKey={(record) => record.dependencyId}
          pagination={{ hideOnSinglePage: true }}
          onRow={(record) => ({
            onMouseEnter: () => setHoverRow(record.dependencyId),
            onMouseLeave: () => setHoverRow(null),
            style: {
              cursor: 'pointer',
              height: 36,
            },
          })}
        />
      )}

      {isDependencyInputShow && (
        <Form layout="inline" initialValues={{ blockedBy: 'blockedBy' }}>
          <Row style={{width: '100%'}}>
            <Col span={14}>
          <Form.Item name={'taskName'}>
            <Select
              placeholder="Search task name"
              size="small"
              showSearch
              options={taskList.map((task) => ({
                label: task.task,
                value: task.taskId,
              }))}
              onSelect={(value) => handleAddDependency(value)}
            />
          </Form.Item>
            </Col>
            
            <Col span={6}>
          <Form.Item name={'blockedBy'}>
            <Select
              options={[
                { key: 'blockedBy', value: 'blockedBy', label: 'Blocked By' },
              ]}
              size="small"
            />
          </Form.Item>
            </Col>

            <Col span={4}>
          <Form.Item>
            <Button
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => setIsDependencyInputShow(false)}
            />
          </Form.Item>
            </Col>
          </Row>
          
        </Form>
      )}

      <Button
        type="text"
        style={{
          width: 'fit-content',
          background: colors.transparent,
          color: colors.skyBlue,
        }}
        onClick={() => setIsDependencyInputShow(true)}
      >
        + Add new dependency
      </Button>
    </Flex>
  );
};

export default DependenciesTable;
