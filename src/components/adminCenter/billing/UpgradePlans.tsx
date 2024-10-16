import { Button, Card, Col, Form, Input, Row, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import './UpgradePlans.css'
import { CheckCircleFilled } from '@ant-design/icons'
import { RootState } from '../../../app/store'
import { useAppSelector } from '../../../hooks/useAppSelector'

const UpgradePlans: React.FC = () => {
    const themeMode = useAppSelector(
        (state: RootState) => state.themeReducer.mode
    )
    const [selectedCard, setSelectedCard] = useState(2) // 2nd card selected by default

    const handleCardSelect = (cardIndex: number) => {
        setSelectedCard(cardIndex)
    }

    const handleValuesChange = (values: any) => {
        if (values.seats <= 15) {
            setSelectedCard(2)
        } else if (values.seats > 15 && values.seats <= 200) {
            setSelectedCard(3)
        } else if (values.seats > 200) {
            setSelectedCard(4)
        }
    }

    const isSelected = (cardIndex: number) => {
        return selectedCard === cardIndex ? { border: '2px solid #1890ff' } : {}
    }

    return (
        <div
            className="upgrade-plans"
            style={{ marginTop: '1.5rem', textAlign: 'center' }}
        >
            <Typography.Title level={2}>
                Select the best plan for your team
            </Typography.Title>

            <Row justify="center">
                <Form
                    initialValues={{ seats: 15 }}
                    onValuesChange={handleValuesChange}
                >
                    <Form.Item name="seats" label="No of seats">
                        <Input type="number" min={15} step={5} />
                    </Form.Item>
                </Form>
            </Row>

            <Row>
                <Col span={6} style={{ padding: '0 4px' }}>
                    <Card
                        style={{ ...isSelected(1), height: '100%' }} // Apply the selected style
                        hoverable
                        title={
                            <span
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    display: 'flex',
                                    gap: '4px',
                                    justifyContent: 'center',
                                }}
                            >
                                Free Plan
                            </span>
                        }
                        onClick={() => handleCardSelect(1)}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto',
                                rowGap: '10px',
                                padding: '20px 20px 0',
                            }}
                        >
                            <Typography.Title level={1}>
                                RS 0.00
                            </Typography.Title>
                            <span>free forever</span>
                            <Typography.Title level={5}>
                                Best for personal use
                            </Typography.Title>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateRows: 'auto auto auto',
                                rowGap: '7px',
                                padding: '10px',
                                justifyItems: 'flex-start',
                            }}
                        >
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>100MB storage</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>3 projects</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>5 team members</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={6} style={{ padding: '0 4px' }}>
                    <Card
                        style={{ ...isSelected(2), height: '100%' }} // Apply the selected style for default card
                        hoverable
                        title={
                            <span
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    display: 'flex',
                                    gap: '4px',
                                    justifyContent: 'center',
                                }}
                            >
                                Startup
                            </span>
                        }
                        onClick={() => handleCardSelect(2)}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto',
                                rowGap: '10px',
                                padding: '20px 20px 0',
                            }}
                        >
                            <Typography.Title level={1}>
                                RS 4990
                            </Typography.Title>
                            <span>FLAT RATE / month</span>
                            <Typography.Title level={5}>
                                Upto 15 users
                            </Typography.Title>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateRows: 'auto auto auto',
                                rowGap: '7px',
                                padding: '10px',
                                justifyItems: 'flex-start',
                            }}
                        >
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>25GB storage</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;
                                <span>Unlimited active projects</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>Schedule</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>Reporting</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;
                                <span>Subscribe to projects</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={6} style={{ padding: '0 4px' }}>
                    <Card
                        style={{ ...isSelected(3), height: '100%' }} // Apply the selected style
                        hoverable
                        title={
                            <span
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    display: 'flex',
                                    gap: '4px',
                                    justifyContent: 'center',
                                }}
                            >
                                Business <Tag color="volcano">Most Popular</Tag>
                            </span>
                        }
                        onClick={() => handleCardSelect(3)}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto',
                                rowGap: '10px',
                                padding: '20px 20px 0',
                            }}
                        >
                            <Typography.Title level={1}>
                                RS 300
                            </Typography.Title>
                            <span>user / month</span>
                            <Typography.Title level={5}>
                                16 - 200 users
                            </Typography.Title>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateRows: 'auto auto auto',
                                rowGap: '7px',
                                padding: '10px',
                                justifyItems: 'flex-start',
                            }}
                        >
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>25GB storage</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;
                                <span>Unlimited active projects</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>Schedule</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>Reporting</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;
                                <span>Subscribe to projects</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={6} style={{ padding: '0 4px' }}>
                    <Card
                        style={{ ...isSelected(4), height: '100%' }} // Apply the selected style
                        hoverable
                        title={
                            <span
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    display: 'flex',
                                    gap: '4px',
                                    justifyContent: 'center',
                                }}
                            >
                                Enterprise
                            </span>
                        }
                        onClick={() => handleCardSelect(4)}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto',
                                rowGap: '10px',
                                padding: '20px 20px 0',
                            }}
                        >
                            <Typography.Title level={1}>
                                RS 250
                            </Typography.Title>
                            <span>user / month</span>
                            <Typography.Title level={5}>
                                200 - 500+ users
                            </Typography.Title>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateRows: 'auto auto auto',
                                rowGap: '7px',
                                padding: '10px',
                                justifyItems: 'flex-start',
                            }}
                        >
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>25GB storage</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;
                                <span>Unlimited active projects</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>Schedule</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;<span>Reporting</span>
                            </div>
                            <div>
                                <CheckCircleFilled
                                    style={{ color: '#52c41a' }}
                                />
                                &nbsp;
                                <span>Subscribe to projects</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <div
                style={{
                    backgroundColor: `${themeMode === 'dark' ? '#141414' : '#e2e3e5'}`,
                    padding: '1rem',
                    marginTop: '1.5rem',
                }}
            >
                <Typography.Title level={4}>
                    Please provide us with a contact number we can use to reach
                    you.
                </Typography.Title>

                <Form>
                    <Row justify="center" style={{ height: '32px' }}>
                        <Form.Item
                            style={{ margin: '0 24px 0 0' }}
                            name="contactNumber"
                            label="Contact Number"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder="07xxxxxxxx" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary">Contact us</Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </div>
    )
}

export default UpgradePlans
