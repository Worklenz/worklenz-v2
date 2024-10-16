import {
    Button,
    Card,
    Col,
    Modal,
    Progress,
    Row,
    Tooltip,
    Typography,
} from 'antd'
import React, { useState } from 'react'
import './CurrentBill.css'
import { InfoCircleTwoTone } from '@ant-design/icons'
import ChargesTable from './billingTables/ChargesTable'
import InvoicesTable from './billingTables/InvoicesTable'
import UpgradePlans from './UpgradePlans'
import { RootState } from '../../../app/store'
import { useAppSelector } from '../../../hooks/useAppSelector'

const CurrentBill: React.FC = () => {
    const themeMode = useAppSelector(
        (state: RootState) => state.themeReducer.mode
    )
    const totalData = 1
    const usedData = 0
    const remainingData = totalData - usedData

    const percentage = (usedData / totalData) * 100

    const [isModalOpen, setIsModalOpen] = useState(false)

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <div style={{ width: '100%' }} className="current-billing">
            <Row>
                <Col span={16} style={{ paddingRight: '10px' }}>
                    <Card
                        title={
                            <span
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                }}
                            >
                                Current Plan Details
                            </span>
                        }
                        extra={
                            <div
                                style={{ marginTop: '8px', marginRight: '8px' }}
                            >
                                <Button type="primary" onClick={showModal}>
                                    Upgrade Plan
                                </Button>
                                <Modal
                                    open={isModalOpen}
                                    onCancel={handleCancel}
                                    width={1000}
                                    centered
                                    okButtonProps={{ hidden: true }}
                                    cancelButtonProps={{ hidden: true }}
                                >
                                    <UpgradePlans />
                                </Modal>
                            </div>
                        }
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '50%',
                                padding: '0 12px',
                            }}
                        >
                            <div style={{ marginBottom: '14px' }}>
                                <Typography.Text style={{ fontWeight: 700 }}>
                                    Free trial
                                </Typography.Text>
                                <Typography.Text>
                                    (Your trial plan expires in 1 month 19 days)
                                </Typography.Text>
                            </div>
                            <Button
                                type="link"
                                style={{ margin: 0, padding: 0, width: '90px' }}
                            >
                                Redeem Code
                            </Button>
                        </div>
                    </Card>
                </Col>

                <Col span={8} style={{ paddingLeft: '10px' }}>
                    <Card
                        title={
                            <span
                                style={{
                                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                }}
                            >
                                Account Storage
                            </span>
                        }
                    >
                        <div style={{ display: 'flex' }}>
                            <div style={{ padding: '0 8px' }}>
                                <Progress
                                    percent={percentage}
                                    type="circle"
                                    format={(percent) => (
                                        <span style={{ fontSize: '13px' }}>
                                            {percent}% Used
                                        </span>
                                    )}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '0 8px',
                                }}
                            >
                                <Typography.Text>
                                    Used: <strong>{usedData} GB</strong>
                                </Typography.Text>
                                <Typography.Text>
                                    Remaining:{' '}
                                    <strong>{remainingData} GB</strong>
                                </Typography.Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: '1.5rem' }}>
                <Card
                    title={
                        <span
                            style={{
                                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                fontWeight: 500,
                                fontSize: '16px',
                                display: 'flex',
                                gap: '4px',
                            }}
                        >
                            <span>Charges</span>
                            <Tooltip title="Charges for the current billing cycle">
                                <InfoCircleTwoTone />
                            </Tooltip>
                        </span>
                    }
                    style={{ marginTop: '16px' }}
                >
                    <ChargesTable />
                </Card>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <Card
                    title={
                        <span
                            style={{
                                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                                fontWeight: 500,
                                fontSize: '16px',
                                display: 'flex',
                                gap: '4px',
                            }}
                        >
                            Invoices
                        </span>
                    }
                    style={{ marginTop: '16px' }}
                >
                    <InvoicesTable />
                </Card>
            </div>
        </div>
    )
}

export default CurrentBill
