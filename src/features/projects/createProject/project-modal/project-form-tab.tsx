import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  ColorPicker,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Select,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { ProjectType } from '../../../../types/project.types';
import { nanoid } from '@reduxjs/toolkit';
import { createProject, toggleProjectModal } from '../../projectSlice';
import {
  healthStatusData,
  projectColors,
  statusData,
} from '../../../../lib/project/projectConstants';
import { CategoryType } from '../../../../types/categories.types';
import { addCategory } from '../../../settings/categories/categoriesSlice';
import { colors } from '../../../../styles/colors';
import { useTranslation } from 'react-i18next';

type ProjectFormTabProps = {
  projectName: string;
  setProjectName: (projectName: string) => void;
};

const ProjectFormTab = ({
  projectName,
  setProjectName,
}: ProjectFormTabProps) => {
  // localization
  const { t } = useTranslation('create-project-modal');

  // get currently active team data from team reducer and find the active team
  const currentlyActiveTeamData = useAppSelector(
    (state) => state.teamReducer.teamsList
  ).find((item) => item.isActive);

  // get categories list from categories reducer
  let categoriesList = useAppSelector(
    (state) => state.categoriesReducer.categoriesList
  );

  // state for show category add input box
  const [isAddCategoryInputShow, setIsAddCategoryInputShow] =
    useState<boolean>(false);
  const [categoryText, setCategoryText] = useState<string>('');

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  // function for handle form submit
  const handleFormSubmit = (values: any) => {
    if (projectName === '') {
      message.error(t('projectNameRequiredMessage'));
      return;
    }

    const newProject: ProjectType = {
      projectId: nanoid(),
      projectName: projectName,
      projectColor: values.color,
      projectStatus: values.status,
      projectHealthStatus: values.health,
      projectCategory: values.category,
      projectNotes: values.notes,
      projectClient: values.client,
      projectManager: values.projectManager,
      projectStartDate: values.startDate,
      projectEndDate: values.endDate,
      projectEstimatedWorkingDays: values.estWorkingDays,
      projectEstimatedManDays: values.estManDays,
      projectHoursPerDays: values.hrsPerDay,
      projectCreated: new Date(),
      isFavourite: false,
      projectTeam: currentlyActiveTeamData?.owner || '',
      projectMemberCount: 0,
    };
    dispatch(createProject(newProject));
    form.resetFields();
    setProjectName('');
    console.log('newProject', newProject);
    dispatch(toggleProjectModal());
  };

  // status selection options
  const statusOptions = [
    ...statusData.map((status, index) => ({
      key: index,
      value: status.value,
      label: (
        <Typography.Text
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          {status.icon}
          {status.label}
        </Typography.Text>
      ),
    })),
  ];

  // health selection options
  const healthOptions = [
    ...healthStatusData.map((status, index) => ({
      key: index,
      value: status.value,
      label: (
        <Typography.Text
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <Badge color={status.color} /> {status.label}
        </Typography.Text>
      ),
    })),
  ];

  // project color options
  const projectColorOptions = [
    ...projectColors.map((color, index) => ({
      key: index,
      value: color,
      label: (
        <div
          style={{
            width: 120,
            height: 24,
            backgroundColor: color,
          }}
        ></div>
      ),
    })),
  ];

  // category input ref
  const categoryInputRef = useRef<InputRef>(null);

  const handleCategoryInputFocus = (open: boolean) => {
    setTimeout(() => {
      categoryInputRef.current?.focus();
    }, 0);
  };

  // show input to add new category
  const handleShowAddCategoryInput = () => {
    setIsAddCategoryInputShow(true);
    handleCategoryInputFocus(true);
  };

  // function to handle category add
  const handleAddCategoryItem = (category: string) => {
    const newCategory: CategoryType = {
      categoryId: nanoid(),
      categoryName: category,
      categoryColor: '#ee87c5',
    };

    dispatch(addCategory(newCategory));
    setCategoryText('');
    setIsAddCategoryInputShow(false);
  };

  return (
    <>
      <div style={{ height: 'calc(100vh - 460px)', overflowY: 'auto' }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleFormSubmit}
          initialValues={{
            color: projectColors[0],
            status: 'proposed',
            health: 'notSet',
            client: [],
            estWorkingDays: 0,
            estManDays: 0,
            hrsPerDay: 8,
          }}
        >
          <Flex gap={32}>
            <Flex vertical gap={8} style={{ width: '50%' }}>
              <Form.Item
                name="key"
                label={t('keyLabel')}
                rules={[
                  {
                    required: true,
                    message: t('keyRequiredMessage'),
                  },
                ]}
              >
                <Input placeholder={t('examplePlaceholder')} />
              </Form.Item>

              <Form.Item
                name="status"
                label={
                  <Flex gap={4}>
                    <Typography.Text>{t('statusLabel')}</Typography.Text>
                    <Typography.Text type="secondary">
                      ({t('optional')})
                    </Typography.Text>
                  </Flex>
                }
              >
                <Select options={statusOptions} />
              </Form.Item>

              <Form.Item
                name="health"
                label={
                  <Flex gap={4}>
                    <Typography.Text>{t('healthLabel')}</Typography.Text>
                    <Typography.Text type="secondary">
                      ({t('optional')})
                    </Typography.Text>
                  </Flex>
                }
              >
                <Select options={healthOptions} />
              </Form.Item>

              <Form.Item
                name="category"
                label={
                  <Flex gap={4}>
                    <Typography.Text>{t('categoryLabel')}</Typography.Text>
                    <Typography.Text type="secondary">
                      ({t('optional')})
                    </Typography.Text>
                  </Flex>
                }
              >
                {!isAddCategoryInputShow ? (
                  <Select
                    options={categoriesList}
                    placeholder={t('categoryPlaceholder')}
                    dropdownRender={() => (
                      <Button
                        style={{ width: '100%' }}
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleShowAddCategoryInput}
                      >
                        {t('newCategoryButton')}
                      </Button>
                    )}
                  />
                ) : (
                  <Flex vertical gap={4}>
                    <Input
                      ref={categoryInputRef}
                      placeholder={t('newCategoryPlaceholder')}
                      value={categoryText}
                      onChange={(e) => setCategoryText(e.currentTarget.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAddCategoryItem(categoryText)
                      }
                    />
                    <Typography.Text style={{ color: colors.lightGray }}>
                      {t('createCategoryHintText')}
                    </Typography.Text>
                  </Flex>
                )}
              </Form.Item>

              <Form.Item
                name="client"
                label={
                  <Flex gap={4}>
                    <Typography.Text>{t('clientLabel')}</Typography.Text>
                    <Typography.Text type="secondary">
                      ({t('optional')})
                    </Typography.Text>
                  </Flex>
                }
              >
                <Input placeholder={t('clientPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="notes"
                label={
                  <Flex gap={4}>
                    <Typography.Text>{t('notesLabel')}</Typography.Text>
                    <Typography.Text type="secondary">
                      ({t('optional')})
                    </Typography.Text>
                  </Flex>
                }
              >
                <Input.TextArea placeholder={t('notesPlaceholder')} />
              </Form.Item>
            </Flex>

            <Flex vertical gap={8} style={{ width: '50%' }}>
              <Form.Item
                name="color"
                label={t('projectColorLabel')}
                layout="horizontal"
              >
                <ColorPicker defaultValue="#1677ff" />
              </Form.Item>

              <Form.Item
                name="projectManager"
                label={t('projectManagerLabel')}
                layout="horizontal"
              >
                <Button
                  type="dashed"
                  shape="circle"
                  icon={<PlusCircleOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="date"
                layout="horizontal"
                style={{ marginBottom: 0 }}
              >
                <Flex gap={8}>
                  <Form.Item name="startDate" label={t('startDateLabel')}>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item name="endDate" label={t('endDateLabel')}>
                    <DatePicker />
                  </Form.Item>
                </Flex>
              </Form.Item>

              <Form.Item
                name="estWorkingDays"
                label={t('estimatedWorkingDaysLabel')}
              >
                <InputNumber
                  min={0}
                  defaultValue={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item name="estManDays" label={t('estimatedManDaysLabel')}>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item name="hrsPerDay" label={t('hoursPerDayLabel')}>
                <InputNumber
                  min={0}
                  max={24}
                  defaultValue={8}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Flex>
          </Flex>
        </Form>
      </div>

      {/* footer  */}
      <Divider style={{ marginBlock: 16 }} />
      <Flex justify="flex-end">
        <Button type="primary" onClick={handleFormSubmit}>
          {t('createButton')}
        </Button>
      </Flex>
    </>
  );
};

export default ProjectFormTab;
