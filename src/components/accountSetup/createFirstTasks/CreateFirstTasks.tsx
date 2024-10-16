import React, { startTransition, useEffect, useState } from 'react'
import { Alert, Button, Form, Input, List, Typography } from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import './CreateFirstTasks.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import { setButtonDisabled } from '../../../features/action-setup/buttonSlice'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

interface CreateFirstTasksProps {
    onContinue: () => void
    onGoBack: () => void
}

interface Task {
    id: number
    value: string
}

const CreateFirstTasks: React.FC<CreateFirstTasksProps> = ({
    onContinue,
    onGoBack,
}) => {
    const dispatch = useDispatch()
    const [tasks, setTasks] = useState<Task[]>([{ id: Date.now(), value: '' }])
    const isButtonDisabled = useSelector(
        (state: RootState) => state.button.isButtonDisable
    )
    const themeMode = useSelector((state: RootState) => state.themeReducer.mode)

    const { t } = useTranslation('createFirstTasks')

    useEffect(() => {
        dispatch(setButtonDisabled(true))
    }, [dispatch])

    const handleInputChange = (
        id: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value
        setTasks(
            tasks.map((task) => (task.id === id ? { ...task, value } : task))
        )

        const isAnyTaskEmpty = tasks.some((task) => task.value.trim() === '')
        dispatch(setButtonDisabled(isAnyTaskEmpty))
    }

    const addTask = () => {
        const lastTask = tasks[tasks.length - 1]
        if (lastTask.value.trim() !== '') {
            setTasks([...tasks, { id: Date.now(), value: '' }])
        } else {
            <Alert
                message="Please fill the task before adding a new one"
                type="error"
            />
        }
    }

    const removeTask = (id: number) => {
        if (tasks.length > 1) {
            setTasks(tasks.filter((task) => task.id !== id))
        }
    }

    const handleGoBack = () => {
        startTransition(() => {
            onGoBack()
        })
    }

    const handleOnContinue = () => {
        startTransition(() => {
            onContinue()
        })
    }

    return (
        <Form
            className="create-first-task-form"
            style={{
                minHeight: '300px',
                width: '600px',
                paddingBottom: '1rem',
                marginBottom: '3rem',
                marginTop: '3rem',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Form.Item>
                <Title level={2} style={{ marginBottom: '1rem' }}>
                    {t('formTitle')}
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
                        {t('inputLable')} "<mark>dff</mark>".
                    </span>
                }
            >
                <List
                    dataSource={tasks}
                    renderItem={(task) => (
                        <List.Item>
                            <div style={{ display: 'flex', width: '600px' }}>
                                <Input
                                    placeholder="Your Task"
                                    value={task.value}
                                    onChange={(e) =>
                                        handleInputChange(task.id, e)
                                    }
                                />
                                <Button
                                    className="custom-close-button"
                                    style={{ marginLeft: '48px' }}
                                    type="text"
                                    icon={
                                        <CloseCircleOutlined
                                            style={{
                                                color:
                                                    themeMode === 'dark'
                                                        ? ''
                                                        : '#00000073',
                                                fontSize: '20px',
                                            }}
                                        />
                                    }
                                    onClick={() => removeTask(task.id)}
                                />
                            </div>
                        </List.Item>
                    )}
                />
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={addTask}
                    style={{ marginTop: '16px' }}
                >
                    {t('addAnother')}
                </Button>
                <div
                    style={{
                        marginTop: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        style={{ padding: 0 }}
                        type="link"
                        onClick={handleGoBack}
                    >
                        {t('goBack')}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isButtonDisabled}
                        onClick={handleOnContinue}
                    >
                        {t('continue')}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default CreateFirstTasks
