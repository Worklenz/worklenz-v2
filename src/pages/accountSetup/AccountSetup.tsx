import React, { useState } from 'react'
import logo from '../../assets/images/logo.png'
import { Space, Steps, Typography } from 'antd'
import OrganizationNameForm from '../../components/accountSetup/organizationName/OrgnizationNameForm'
import CreateFirstProjectForm from '../../components/accountSetup/createFirstProject/CreateFirstProjectForm'
import CreateFirstTasks from '../../components/accountSetup/createFirstTasks/CreateFirstTasks'
import InviteInitialTeamMembers from '../../components/accountSetup/inviteInitialTeamMembers/InviteInitialTeamMembers'
import './AccountSetup.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

const AccountSetup: React.FC = () => {
    const [current, setCurrent] = useState(0)
    const isButtonDisabled = useSelector(
        (state: RootState) => state.button.isButtonDisable
    )
    const themeMode = useSelector((state: RootState) => state.themeReducer.mode)

    const { t } = useTranslation('accountSetupPage')

    const steps = [
        {
            title: '',
            content: (
                <OrganizationNameForm
                    onContinue={() => setCurrent(current + 1)}
                />
            ),
        },
        {
            title: '',
            content: (
                <CreateFirstProjectForm
                    onContinue={() => setCurrent(current + 1)}
                    onGoBack={() => setCurrent(current - 1)}
                />
            ),
        },
        {
            title: '',
            content: (
                <CreateFirstTasks
                    onContinue={() => setCurrent(current + 1)}
                    onGoBack={() => setCurrent(current - 1)}
                />
            ),
        },
        {
            title: '',
            content: (
                <InviteInitialTeamMembers
                    onGoBack={() => setCurrent(current - 1)}
                />
            ),
        },
    ]

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '3rem',
                paddingBottom: '3rem',
                backgroundColor: themeMode === 'dark' ? 'black' : '#FAFAFA',
            }}
        >
            <div>
                <img src={logo} alt="Logo" width={235} height={50} />
            </div>
            <Title
                level={5}
                style={{
                    textAlign: 'center',
                    marginTop: '4px',
                    marginBottom: '24px',
                }}
            >
                {t('setupYourAccount')}
            </Title>
            <div
                style={{
                    backgroundColor: themeMode === 'dark' ? '#141414' : 'white',
                    marginTop: '1.5rem',
                    paddingTop: '3rem',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    width: '100%',
                    maxWidth: '66.66667%',
                    maxHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Space
                    className={themeMode === 'dark' ? 'dark-mode' : ''}
                    direction="vertical"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0',
                        flexGrow: 1,
                        width: '100%',
                    }}
                >
                    <Steps
                        className={isButtonDisabled ? 'step' : 'progress-steps'}
                        current={current}
                        items={steps}
                        style={{
                            marginTop: '1rem',
                            marginBottom: '1rem',
                            width: '600px',
                        }}
                    />
                    <div
                        className="step-content"
                        style={{ flexGrow: 1, width: '600px' }}
                    >
                        {steps[current].content}
                    </div>
                </Space>
            </div>
        </div>
    )
}

export default AccountSetup
