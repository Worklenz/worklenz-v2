import { EditOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-components'
import { Button, Card, Input, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import OrganizationAdminsTable from './OrganizationAdminsTable'
import TextArea from 'antd/es/input/TextArea'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { RootState } from '../../../app/store'

const { Text } = Typography

const Overview: React.FC = () => {
    const [isEditable, setIsEditable] = useState(false)
    const [name, setName] = useState('Raveesha Dilanka')
    const [isEditableContactNumber, setIsEditableContactNumber] =
        useState(false)

    const themeMode = useAppSelector(
        (state: RootState) => state.themeReducer.mode
    )

    const handleEdit = () => {
        setIsEditable(true)
    }

    const handleBlur = () => {
        setIsEditable(false)
    }

    const handleNameChange = (e: any) => {
        setName(e.target.value)
    }

    const addContactNumber = () => {
        setIsEditableContactNumber(true)
    }

    const handleContactNumberBlur = () => {
        setIsEditableContactNumber(false)
    }

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title={<span>Overview</span>}
                style={{ padding: '16px 0' }}
            />
            <Card>
                <div
                    style={{
                        marginTop: 0,
                        marginBottom: '0.5rem',
                        color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                        fontWeight: 500,
                        fontSize: '16px',
                    }}
                >
                    Organization Name
                </div>
                <div style={{ paddingTop: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        {isEditable ? (
                            <TextArea
                                style={{ height: '32px' }}
                                value={name}
                                onChange={handleNameChange}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Text
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                }}
                            >
                                {name}{' '}
                                <Tooltip title="Edit">
                                    <Button
                                        onClick={handleEdit}
                                        size="small"
                                        type="link"
                                        icon={<EditOutlined />}
                                    />
                                </Tooltip>
                            </Text>
                        )}
                    </div>
                </div>
            </Card>

            <div style={{ marginTop: '1.5rem' }} />

            <Card>
                <div
                    style={{
                        marginTop: 0,
                        marginBottom: '0.5rem',
                        color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                        fontWeight: 500,
                        fontSize: '16px',
                    }}
                >
                    Organization Owner
                </div>
                <div style={{ paddingTop: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <Text
                            style={{
                                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                            }}
                        >
                            Raveesha Dilanka
                        </Text>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text
                        style={{
                            color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                        }}
                    >
                        <span style={{ marginRight: '8px' }}>
                            <MailOutlined />
                        </span>
                        raveeshadilanka1999@gmail.com
                    </Text>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <Tooltip title="Contact Number">
                        <span style={{ marginRight: '8px' }}>
                            <PhoneOutlined />
                        </span>
                    </Tooltip>
                    {isEditableContactNumber ? (
                        <Input
                            onBlur={handleContactNumberBlur}
                            style={{ width: '200px' }}
                        />
                    ) : (
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={addContactNumber}
                        >
                            Add Contact Number
                        </Button>
                    )}
                </div>
            </Card>

            <div style={{ marginTop: '1.5rem' }} />

            <Card>
                <div
                    style={{
                        marginTop: 0,
                        marginBottom: '0.5rem',
                        color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                        fontWeight: 500,
                        fontSize: '16px',
                    }}
                >
                    Organization Admins
                </div>
                <OrganizationAdminsTable />
            </Card>
        </div>
    )
}

export default Overview
