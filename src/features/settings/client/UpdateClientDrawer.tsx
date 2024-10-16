import { Button, Drawer, Form, Input, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { toggleUpdateClientDrawer, updateClient } from './clientSlice'
import { ClientType } from '../../../types/client.types'

type UpdateClientDrawerProps = {
    selectedClientId: string | null
}

const UpdateClientDrawer = ({ selectedClientId }: UpdateClientDrawerProps) => {
    // get data from client reducer
    const clientsList = useAppSelector(
        (state) => state.clientReducer.clientsList
    )

    // get data of currentlt selectedClient
    const selectedClient = clientsList.find(
        (client) => client.clientId === selectedClientId
    )

    const isDrawerOpen = useAppSelector(
        (state) => state.clientReducer.isUpdateClientDrawerOpen
    )
    const dispatch = useAppDispatch()

    const [form] = Form.useForm()

    // Load the selected client details to the form when drawer opens
    useEffect(() => {
        if (selectedClient) {
            form.setFieldsValue({
                name: selectedClient.clientName,
            })
        }
    }, [selectedClient, form])

    // this function for handle form submit
    const handleFormSubmit = (values: any) => {
        if (selectedClient) {
            const updatedClient: ClientType = {
                ...selectedClient,
                clientName: values.name,
            }

            dispatch(updateClient(updatedClient))
            dispatch(toggleUpdateClientDrawer())
        }
    }

    return (
        <Drawer
            title={
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                    Update Client
                </Typography.Text>
            }
            open={isDrawerOpen}
            onClose={() => dispatch(toggleUpdateClientDrawer())}
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
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default UpdateClientDrawer
