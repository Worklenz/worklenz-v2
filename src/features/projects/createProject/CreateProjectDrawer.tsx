import {
    Badge,
    Button,
    DatePicker,
    Drawer,
    Flex,
    Form,
    Input,
    message,
    Select,
    Tag,
    Typography,
} from 'antd'
import React from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { createProject, toggleDrawer } from '../projectSlice'
import { PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { ProjectType } from '../../../types/project.types'
import { nanoid } from '@reduxjs/toolkit'
import {
    healthStatusData,
    projectColors,
    statusData,
} from '../projectConstants'

const CreateProjectDrawer = () => {
    const isDrawerOpen = useAppSelector(
        (state) => state.projectReducer.isDrawerOpen
    )
    const dispatch = useAppDispatch()

    const [form] = Form.useForm()

    // function for handle form submit
    const handleFormSubmit = (values: any) => {
        const newProject: ProjectType = {
            projectId: nanoid(),
            projectName: values.name,
            isFavourite: false,
            projectColor: values.color,
        }
        dispatch(createProject(newProject))
        message.success('project created!')
        form.resetFields()
        dispatch(toggleDrawer())
    }

    // status selection options
    const statusOptions = [
        ...statusData.map((status, index) => ({
            key: index,
            value: status.value,
            label: (
                <Typography.Text
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    {status.icon}
                    {status.label}
                </Typography.Text>
            ),
        })),
    ]

    // health selection options
    const healthOptions = [
        ...healthStatusData.map((status, index) => ({
            key: index,
            value: status.value,
            label: (
                <Typography.Text
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    <Badge color={status.color} /> {status.label}
                </Typography.Text>
            ),
        })),
    ]

    // project color options
    const projectColorOptions = [
        ...projectColors.map((color, index) => ({
            key: index,
            value: color,
            label: (
                <Tag
                    color={color}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                    }}
                />
            ),
        })),
    ]

    return (
        <Drawer
            title={
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                    Create Project
                </Typography.Text>
            }
            open={isDrawerOpen}
            onClose={() => dispatch(toggleDrawer())}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{
                    color: '#154c9b',
                    status: 'proposed',
                    health: 'notSet',
                    estWorkingDays: 0,
                    estManDays: 0,
                    hrsPerDay: 8,
                }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a Name',
                        },
                    ]}
                >
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                    name="color"
                    label="Project Color"
                    layout="horizontal"
                    required
                >
                    <Select
                        variant="borderless"
                        suffixIcon={null}
                        options={projectColorOptions}
                        style={{
                            width: 60,
                        }}
                    />
                </Form.Item>
                <Form.Item name="status" label="Status">
                    <Select options={statusOptions} />
                </Form.Item>
                <Form.Item name="health" label="Health">
                    <Select options={healthOptions} />
                </Form.Item>
                <Form.Item name="categorey" label="Categorey">
                    <Select
                        options={healthOptions}
                        placeholder="Add a category to the project"
                    />
                </Form.Item>
                <Form.Item name="notes" label="Notes">
                    <Input.TextArea placeholder="Notes" />
                </Form.Item>
                <Form.Item
                    name="client"
                    label={
                        <Typography.Text>
                            Client <QuestionCircleOutlined />
                        </Typography.Text>
                    }
                >
                    <Input placeholder="Select client" />
                </Form.Item>
                <Form.Item
                    name="projectManager"
                    label="Project Manager"
                    layout="horizontal"
                >
                    <Button
                        type="dashed"
                        shape="circle"
                        icon={<PlusCircleOutlined />}
                    />
                </Form.Item>
                <Form.Item name="date" layout="horizontal">
                    <Flex gap={8}>
                        <Form.Item name="startDate" label="Start Date">
                            <DatePicker />
                        </Form.Item>
                        <Form.Item name="endDate" label="End Date">
                            <DatePicker />
                        </Form.Item>
                    </Flex>
                </Form.Item>
                <Form.Item name="estWorkingDays" label="Estimate working days">
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="estManDays" label="Estimate man days">
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="hrsPerDay" label="Hours per day">
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        style={{ width: '100%' }}
                        htmlType="submit"
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default CreateProjectDrawer
