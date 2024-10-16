import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import { Button, Drawer, Form, Input, message, Typography } from 'antd'
import { TeamsType } from '../../../types/adminCenter/team.types'
import { nanoid } from '@reduxjs/toolkit'
import { addTeam, toggleDrawer } from './teamSlice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

const CreateTeamDrawer: React.FC = () => {
    const isDrawerOpen = useSelector(
        (state: RootState) => state.teamReducer.isDrawerOpen
    )
    const dispatch = useAppDispatch()
    const [form] = Form.useForm()

    const handleFormSubmit = (values: any) => {
        const newTeam: TeamsType = {
            teamId: nanoid(),
            teamName: values.name,
            membersCount: 1,
            members: ['Raveesha Dilanka'],
            created: new Date(),
        }

        dispatch(addTeam(newTeam))
        dispatch(toggleDrawer())
        form.resetFields()
        message.success('Team added!')
    }

    return (
        <Drawer
            title={
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                    Create New Team
                </Typography.Text>
            }
            open={isDrawerOpen}
            onClose={() => dispatch(toggleDrawer())}
        >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                    name="name"
                    label="Team name"
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

export default CreateTeamDrawer
