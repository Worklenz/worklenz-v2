import { Button, Drawer, Form, Input, Typography } from 'antd'
import React from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { addClient, toggleCreateClientDrawer } from './clientSlice'
import { ClientType } from '../../../types/client.types'
import { nanoid } from '@reduxjs/toolkit'

const CreateClientDrawer = () => {
    // get drawer state from client reducer
    const isDrawerOpen = useAppSelector(
        (state) => state.clientReducer.isCreateClientDrawerOpen
    )
    const dispatch = useAppDispatch()

    const [form] = Form.useForm()

    // this function for handle form submit
    const handleFormSubmit = (values: any) => {
        const newClient: ClientType = {
            clientId: nanoid(),
            clientName: values.name,
            project: null,
        }

        dispatch(addClient(newClient))
        dispatch(toggleCreateClientDrawer())
        form.resetFields()
    }

    return (
        <Drawer
            title={
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                    Create Client
                </Typography.Text>
            }
            open={isDrawerOpen}
            onClose={() => dispatch(toggleCreateClientDrawer())}
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

export default CreateClientDrawer
