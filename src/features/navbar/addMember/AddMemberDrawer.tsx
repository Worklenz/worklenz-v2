import {
    Button,
    Drawer,
    Flex,
    Form,
    Input,
    message,
    Select,
    Typography,
} from 'antd'
import React from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { addMember, toggleDrawer } from './addMemberSlice'
import { colors } from '../../../styles/colors'
import { MemberType } from '../../../types/member.types'
import { nanoid } from '@reduxjs/toolkit'

const AddMemberDrawer = () => {
    const isDrawerOpen = useAppSelector(
        (state) => state.addMemberReducer.isDrawerOpen
    )
    const dispatch = useAppDispatch()

    // get job titles from redux - job reducer
    const jobsList = useAppSelector((state) => state.jobReducer.jobsList)

    const [form] = Form.useForm()

    // function for handle form submit
    const handleFormSubmit = (values: any) => {
        const newMember: MemberType = {
            memberId: nanoid(),
            memberName: values.name,
            memberEmail: values.email,
            memberRole: values.access,
        }
        dispatch(addMember(newMember))
        message.success('member added!')
        form.resetFields()
        dispatch(toggleDrawer())
    }

    return (
        <Drawer
            title={
                <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
                    Add Member
                </Typography.Text>
            }
            open={isDrawerOpen}
            onClose={() => dispatch(toggleDrawer())}
        >
            <Form
                form={form}
                onFinish={handleFormSubmit}
                layout="vertical"
                initialValues={{ access: 'member' }}
            >
                <Form.Item
                    label="Email(s)"
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            required: true,
                            message: 'Please enter a email',
                        },
                    ]}
                >
                    <Flex vertical gap={4}>
                        <Input
                            type="email"
                            placeholder="Add team members by email"
                        />
                        <Typography.Text
                            style={{ fontSize: 12, color: colors.lightGray }}
                        >
                            Invitees will be added to the team either they
                            accept the invitation or not.
                        </Typography.Text>
                    </Flex>
                </Form.Item>

                <Form.Item label="Job Title" name="jobTitle">
                    <Select
                        size="middle"
                        placeholder="Select the job title (Optional)"
                        // dropdownRender={(menu) => (
                        //     <>
                        //         {menu}
                        //         <Divider style={{ margin: '8px 0' }} />
                        //         <Space style={{ padding: '0 8px 4px' }}>
                        //             <Input
                        //                 placeholder="Please enter item"
                        //                 ref={inputRef}
                        //                 value={name}
                        //                 onChange={onNameChange}
                        //             />
                        //             <Button
                        //                 type="text"
                        //                 icon={<PlusOutlined />}
                        //                 onClick={addItem}
                        //             >
                        //                 Add item
                        //             </Button>
                        //         </Space>
                        //     </>
                        // )}
                        options={jobsList.map((job) => ({
                            label: job.jobTitle,
                            value: job.jobTitle,
                        }))}
                        suffixIcon={false}
                    />
                </Form.Item>

                <Form.Item label="Access" name="access">
                    <Select
                        options={[
                            { value: 'member', label: 'Member' },
                            { value: 'owner', label: 'Admin' },
                        ]}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        style={{ width: '100%' }}
                        htmlType="submit"
                    >
                        Add to team
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default AddMemberDrawer
