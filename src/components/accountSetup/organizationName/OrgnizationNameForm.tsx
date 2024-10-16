import React, { startTransition, useEffect, useState } from 'react'
import { Button, Form, Input, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import { setButtonDisabled } from '../../../features/action-setup/buttonSlice'
import './OrganizationNameForm.css'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

interface OrganizationNameProps {
    onContinue: () => void
}

const OrganizationNameForm: React.FC<OrganizationNameProps> = ({
    onContinue,
}) => {
    const dispatch = useDispatch()
    const [inputValue, setInputValue] = useState('')
    const isButtonDisabled = useSelector(
        (state: RootState) => state.button.isButtonDisable
    )
    const themeMode = useSelector((state: RootState) => state.themeReducer.mode)

    const { t } = useTranslation('organizationNameFormPage')

    useEffect(() => {
        dispatch(setButtonDisabled(true))
    }, [dispatch])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)

        if (value.trim() === '') {
            dispatch(setButtonDisabled(true))
        } else {
            dispatch(setButtonDisabled(false))
        }
    }

    const handleOnContinue = () => {
        startTransition(() => {
            onContinue()
        })
    }

    return (
        <Form
            className="organization-name-form"
            style={{
                width: '600px',
                paddingBottom: '1rem',
                marginBottom: '3rem',
                marginTop: '3rem',
            }}
        >
            <Form.Item>
                <Title level={2} style={{ marginBottom: '1rem' }}>
                    {t('nameYourOrganization')}
                </Title>
            </Form.Item>
            <Form.Item
                layout="vertical"
                rules={[{ required: true }]}
                label={
                    <span
                        style={{
                            color: themeMode === 'dark' ? '' : '#00000073',
                            fontWeight: 500,
                        }}
                    >
                        {t('worklenzAccountTitle')}
                    </span>
                }
            >
                <Input
                    placeholder="e.g., test01's Team"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Form.Item>
            <div style={{ display: 'flex', marginTop: '5rem' }}></div>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isButtonDisabled}
                    onClick={handleOnContinue}
                >
                    {t('continue')}
                </Button>
            </Form.Item>
        </Form>
    )
}

export default OrganizationNameForm
