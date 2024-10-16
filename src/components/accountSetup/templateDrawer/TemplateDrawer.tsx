import { List, Tabs, Tag, Typography } from 'antd'
import React from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './TemplateDrawer.css'
import { RootState } from '../../../app/store'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

const TemplateDrawer: React.FC = () => {
    const themeMode = useSelector((state: RootState) => state.themeReducer.mode)

    const { t } = useTranslation('templateDrawer')

    type MenuItem = Required<MenuProps>['items'][number]

    const data = [
        'Testing and Verification',
        'Bug Prioritization',
        'Bug reporting',
        'Bug Assignment',
        'Bug Closure',
        'Documentation',
        'Reporting',
    ]

    const items: MenuItem[] = [
        { key: '1', label: t('bugTracking') },
        { key: '2', label: t('construction') },
        { key: '3', label: t('designCreative') },
        { key: '4', label: t('education') },
        { key: '5', label: t('finance') },
        { key: '6', label: t('hrRecruiting') },
        { key: '7', label: t('informationTechnology') },
        { key: '8', label: t('legal') },
        { key: '9', label: t('manufacturing') },
        { key: '10', label: t('marketing') },
        { key: '11', label: t('nonprofit') },
        { key: '12', label: t('personalUse') },
        { key: '13', label: t('salesCRM') },
        { key: '14', label: t('serviceConsulting') },
        { key: '15', label: t('softwareDevelopment') },
    ]

    const onClick = () => {}

    const tabs = [
        {
            key: '1',
            label: 'Template 1',
            children: (
                <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
                    {/* Menu Area */}
                    <div
                        style={{
                            minWidth: '250px',
                            overflowY: 'auto',
                            height: '100%',
                        }}
                    >
                        <Menu
                            className="template-menu"
                            onClick={onClick}
                            style={{ width: 256 }}
                            defaultSelectedKeys={['1']}
                            mode="inline"
                            items={items}
                        />
                    </div>
                    {/* Content Area */}
                    <div className="temp-details" style={{ flex: 1 }}>
                        {/* Placeholder for content */}
                        <Title level={4}>Details</Title>
                        <img
                            src="https://worklenz.s3.amazonaws.com/project-template-gifs/bug-tracking.gif"
                            alt="preview"
                        />
                        <div>
                            {/* Description */}
                            <div
                                style={{
                                    display: 'flex',
                                    marginBottom: '1rem',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '120px',
                                        minWidth: '120px',
                                    }}
                                >
                                    <Text style={{ fontWeight: 500 }}>
                                        {t('description')}
                                    </Text>
                                </div>
                                <div>
                                    <Text>
                                        The “Bug Tracking” project template is a
                                        versatile solution meticulously designed
                                        to streamline and enhance the bug
                                        management processes of businesses
                                        across diverse industries. This template
                                        is especially valuable for organizations
                                        that rely on software development, IT
                                        services, or digital product management.
                                        It provides a structured and efficient
                                        approach to tracking, resolving, and
                                        improving software issues.
                                    </Text>
                                </div>
                            </div>

                            {/* Phase */}
                            <div
                                style={{
                                    display: 'flex',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '120px',
                                        minWidth: '120px',
                                    }}
                                >
                                    <Text style={{ fontWeight: 500 }}>
                                        {t('phase')}
                                    </Text>
                                </div>
                                <div>
                                    <Tag
                                        color="#75c9c069"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Incoming
                                    </Tag>
                                    <Tag
                                        color="#3b7ad469"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Backlog
                                    </Tag>
                                    <Tag
                                        color="#7781ca69"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Development work
                                    </Tag>
                                    <Tag
                                        color="#bf494969"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Resolved
                                    </Tag>
                                    <Tag
                                        color="#ff9c3c69"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Testing & Review
                                    </Tag>
                                </div>
                            </div>

                            {/* Statuses */}
                            <div
                                style={{
                                    display: 'flex',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '120px',
                                        minWidth: '120px',
                                    }}
                                >
                                    <Text style={{ fontWeight: 500 }}>
                                        {t('statuses')}
                                    </Text>
                                </div>
                                <div>
                                    <Tag
                                        color="#a9a9a969"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        To Do
                                    </Tag>
                                    <Tag
                                        color="#70a6f369"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Doing
                                    </Tag>
                                    <Tag
                                        color="#70a6f369"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Done
                                    </Tag>
                                </div>
                            </div>

                            {/* Priorities */}
                            <div
                                style={{
                                    display: 'flex',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '120px',
                                        minWidth: '120px',
                                    }}
                                >
                                    <Text style={{ fontWeight: 500 }}>
                                        {t('priorities')}
                                    </Text>
                                </div>
                                <div>
                                    <Tag
                                        color="#75c99769"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Low
                                    </Tag>
                                    <Tag
                                        color="#fbc84c69"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Medium
                                    </Tag>
                                    <Tag
                                        color="#f3707069"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        High
                                    </Tag>
                                </div>
                            </div>

                            {/* Labels */}
                            <div
                                style={{
                                    display: 'flex',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '120px',
                                        minWidth: '120px',
                                    }}
                                >
                                    <Text style={{ fontWeight: 500 }}>
                                        {t('labels')}
                                    </Text>
                                </div>
                                <div>
                                    <Tag
                                        color="#cbbc7869"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        UI/UX Bug
                                    </Tag>
                                    <Tag
                                        color="#7781ca69"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Ready for Dev
                                    </Tag>
                                    <Tag
                                        color="#cb987869"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Regression
                                    </Tag>
                                    <Tag
                                        color="#154c9b69"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Critical
                                    </Tag>
                                    <Tag
                                        color="#905b3969"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Awaiting review
                                    </Tag>
                                    <Tag
                                        color="#cbc8a169"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Fixed
                                    </Tag>
                                    <Tag
                                        color="#aacb7869"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Duplicate
                                    </Tag>
                                    <Tag
                                        color="#ee87c569"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Documentation
                                    </Tag>
                                    <Tag
                                        color="#80ca7969"
                                        style={{
                                            color: 'black',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Fixing
                                    </Tag>
                                </div>
                            </div>

                            {/* Tasks */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '120px',
                                        minWidth: '120px',
                                    }}
                                >
                                    <Text style={{ fontWeight: 500 }}>
                                        {t('tasks')}
                                    </Text>
                                </div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <List
                                        dataSource={data}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <Text>{item}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Sticky Tabs Header */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: themeMode === 'dark' ? '' : '#fff',
                    overflow: 'hidden',
                }}
            >
                <Tabs type="card" items={tabs} />
            </div>
        </div>
    )
}

export default TemplateDrawer
