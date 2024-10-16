import { PageHeader } from '@ant-design/pro-components'
import { Tabs, TabsProps } from 'antd'
import React from 'react'
import CurrentBill from '../../../components/adminCenter/billing/CurrentBill'
import Configuration from '../../../components/adminCenter/configuration/Configuration'

const Billing: React.FC = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Current Bill',
            children: <CurrentBill />,
        },
        {
            key: '2',
            label: 'Configuration',
            children: <Configuration />,
        },
    ]

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title={<span>Billings</span>}
                style={{ padding: '16px 0' }}
            />
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}

export default Billing
