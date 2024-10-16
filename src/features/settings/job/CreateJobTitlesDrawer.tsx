import { Button, Drawer, Form, Input, message, Typography } from 'antd'
import React from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { nanoid } from '@reduxjs/toolkit'
import { addJobTitle, toggleCreateJobTitleDrawer } from './jobSlice'
import { JobType } from '../../../types/job.types'

const CreateJobTitlesDrawer = () => {
    const isDrawerOpen = useAppSelector(
        (state) => state.jobReducer.isCreateJobTitleDrawerOpen
    )
    const dispatch = useAppDispatch()

    const [form] = Form.useForm()

    // this function for handle form submit
    const handleFormSubmit = (values: any) => {
        const newJobTitle: JobType = {
            jobId: nanoid(),
            jobTitle: values.name,
        }

        dispatch(addJobTitle(newJobTitle))
        dispatch(toggleCreateJobTitleDrawer())
        form.resetFields()
        message.success('Job title added!')
    }

    return (
        <Drawer
            title={
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                    Create Title
                </Typography.Text>
            }
            open={isDrawerOpen}
            onClose={() => dispatch(toggleCreateJobTitleDrawer())}
        >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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

export default CreateJobTitlesDrawer
