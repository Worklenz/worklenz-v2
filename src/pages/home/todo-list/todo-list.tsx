import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Flex,
  Form,
  Input,
  InputRef,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import TodoDoneButton from './todo-done-button';
import { IMyTask } from '@/types/home/my-tasks.types';
import { homePageApiService } from '@/api/home-page/home-page.api.service';
import { useTranslation } from 'react-i18next';
import { colors } from '@/styles/colors';

const TodoList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [form] = Form.useForm();
  const [personalTasks, setPersonalTasks] = useState<IMyTask[]>([]);
  const { t } = useTranslation('home');

  // ref for todo input field
  const todoInputRef = useRef<InputRef | null>(null);

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const getPersonalTasks = async () => {
    setIsLoading(true);
    const res = await homePageApiService.getPersonalTasks();
    if (res.done) {
      setPersonalTasks(res.body);
    }
    setIsLoading(false);
  };

  // function to handle todo submit
  const handleTodoSubmit = async (values: any) => {
    const newTodo: IMyTask = {
      name: values.name,
      done: false,
      is_task: false,
      color_code: '#000',
    };

    const res = await homePageApiService.createPersonalTask(newTodo);
    if (res.done) {
      getPersonalTasks();
    }

    setIsAlertShowing(false);
    form.resetFields();
  };

  const handleCompleteTodo = async (id: string | undefined) => {
    if (!id) return;
    const updatedTasks = personalTasks.map(task => {
      if (task.id === id) {
        return { ...task, done: true };
      }
      return task;
    });
    setPersonalTasks(updatedTasks);
    
    const res = await homePageApiService.markPersonalTaskAsDone(id);
    if (res.done) {
      setTimeout(() => {
        getPersonalTasks();
      }, 500);
    }
  };

  // table columns
  const columns: TableProps<IMyTask>['columns'] = [
    {
      key: 'completeBtn',
      width: 32,
      render: (record: IMyTask) => (
        <ConfigProvider wave={{ disabled: true }}>
          <Tooltip title={t('home:todoList.markAsDone')}>
            <Button
              type="text"
              className="borderless-icon-btn"
              style={{ backgroundColor: colors.transparent }}
              shape="circle"
              icon={<CheckCircleOutlined style={{ color: record.done ? colors.limeGreen : colors.lightGray }} />}
              onClick={() => handleCompleteTodo(record.id)}
            />
          </Tooltip>
        </ConfigProvider>
      ),
    },
    {
      key: 'name',
      render: (record: IMyTask) => (
        <Typography.Paragraph style={{ margin: 0, paddingInlineEnd: 6 }}>
          <Tooltip title={record.name}>{record.name}</Tooltip>
        </Typography.Paragraph>
      ),
    },
  ];

  useEffect(() => {
    getPersonalTasks();
  }, []);

  return (
    <Card
      title={
        <Typography.Title level={5} style={{ marginBlockEnd: 0 }}>
          {t('home:todoList.title')} ({personalTasks.length})
        </Typography.Title>
      }
      extra={
        <Tooltip title={t('home:todoList.refreshTasks')}>
          <Button
            shape="circle"
            icon={<SyncOutlined spin={isLoading} />}
            onClick={() => handleRefresh()}
          />
        </Tooltip>
      }
      style={{ width: '100%' }}
    >
      {(
        <div>
          <Form form={form} onFinish={handleTodoSubmit}>
            <Form.Item name="name">
              <Flex vertical gap={4}>
                <Input
                  ref={todoInputRef}
                  placeholder={t('home:todoList.addTask')}
                  onChange={e => {
                    const inputValue = e.currentTarget.value;

                    if (inputValue.length >= 1) setIsAlertShowing(true);
                    else if (inputValue === '') setIsAlertShowing(false);
                  }}
                />
                {isAlertShowing && (
                  <Alert
                    message={
                      <Typography.Text style={{ fontSize: 11 }}>
                        {t('home:todoList.pressEnter')} <strong>Enter</strong>{' '}
                        {t('home:todoList.toCreate')}
                      </Typography.Text>
                    }
                    type="info"
                    style={{
                      width: 'fit-content',
                      borderRadius: 2,
                      padding: '0 6px',
                    }}
                  />
                )}
              </Flex>
            </Form.Item>
          </Form>

          {personalTasks.length === 0 ? (
            <EmptyListPlaceholder
              imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
              text={t('home:todoList.noTasks')}
            />
          ) : (
            <Table
              className="custom-two-colors-row-table"
              rowKey={record => record.id || ''}
              dataSource={personalTasks}
              columns={columns}
              showHeader={false}
              pagination={false}
              size="small"
              loading={isLoading}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default TodoList;
