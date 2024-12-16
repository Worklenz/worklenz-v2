import { useEffect, useRef, useState } from 'react';

import {
  AutoComplete,
  Badge,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputRef,
  message,
  Select,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { createProject, toggleDrawer } from '../../../features/projects/projectsSlice';
import { addCategory } from '../../../features/settings/categories/categoriesSlice';

import { projectColors } from '../../../lib/project/projectConstants';
import { colors } from '../../../styles/colors';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { IProjectCategory } from '@/types/project/projectCategory.types';

import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { PlusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { fetchClients } from '@/features/settings/client/clientSlice';
import { getStatusIcon } from '@/utils/projectUtils';

const ProjectDrawer = () => {
  const dispatch = useAppDispatch();

  // get categories list from categories reducer
  const { categories } = useAppSelector(state => state.projectCategoriesReducer);
  const { statuses } = useAppSelector(state => state.projectStatusesReducer);
  const { healths } = useAppSelector(state => state.projectHealthReducer);
  const { clients, loading } = useAppSelector(state => state.clientReducer);

  useEffect(() => {
    if (!healths.length) dispatch(fetchProjectHealth());
    if (!clients.data?.length)
      dispatch(fetchClients({ index: 1, size: 5, field: null, order: null, search: null }));
  }, [dispatch]);

  // state for show category add input box
  const [isAddCategoryInputShow, setIsAddCategoryInputShow] = useState<boolean>(false);
  const [categoryText, setCategoryText] = useState<string>('');

  const isDrawerOpen = useAppSelector(state => state.projectsReducer.isProjectDrawerOpen);

  const [form] = Form.useForm();

  // function for handle form submit
  const handleFormSubmit = (values: any) => {
    const newProject: IProjectViewModel = {
      name: values.name,
      color_code: values.color,
      status_id: values.status,
      category_id: values.category,
      health_id: values.health,
      notes: values.notes,
      client_id: values.client,
      project_manager: values.projectManager,
      start_date: values.startDate,
      end_date: values.endDate,
      working_days: values.estWorkingDays,
      man_days: values.estManDays,
      hours_per_day: values.hrsPerDay,
    };
    dispatch(createProject(newProject));
    form.resetFields();
    dispatch(toggleDrawer());
  };

  // status selection options
  const statusOptions = [
    ...statuses.map((status, index) => ({
      key: index,
      value: status.id,
      label: (
        <Typography.Text style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {status.icon && status.color_code && getStatusIcon(status.icon, status.color_code)}
          {status.name}
        </Typography.Text>
      ),
    })),
  ];

  // health selection options
  const healthOptions = [
    ...healths.map((status, index) => ({
      key: index,
      value: status.id,
      label: (
        <Typography.Text style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Badge color={status.color_code} /> {status.name}
        </Typography.Text>
      ),
    })),
  ];

  const categoryOptions = [
    ...categories.map((category, index) => ({
      key: index,
      value: category.id,
      label: category.name,
    })),
  ];

  // client options
  const clientOptions = [
    ...(clients.data?.map((client, index) => ({
      key: index,
      value: client.id,
      label: client.name,
    })) || []),
  ];

  // project color options
  const projectColorOptions = [
    ...projectColors.map((color, index) => ({
      key: index,
      value: color,
      label: (
        <Tag
          color={color}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
          }}
        />
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
    const newCategory: IProjectCategory = {
      name: category,
      color_code: '#ee87c5',
    };

    dispatch(addCategory(newCategory));
    setCategoryText('');
    setIsAddCategoryInputShow(false);
  };

  const handleClientSearch = (value: string): void => {
    if (value.length > 2 || value.length === 0)
      dispatch(
        fetchClients({ index: 1, size: 5, field: null, order: null, search: value || null })
      );
  };

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>Create Project</Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleDrawer())}
    >
      {/* create project form  */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          color: projectColors[0],
          status: statuses.find(status => status.is_default)?.id,
          health: healths.find(health => health.is_default)?.id,
          client: [],
          working_days: 0,
          man_days: 0,
          hours_per_day: 8,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter a name',
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="color" label="Project Color" layout="horizontal" required>
          <Select
            variant="borderless"
            suffixIcon={null}
            options={projectColorOptions}
            style={{
              width: 60,
            }}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item name="health" label="Health">
          <Select options={healthOptions} />
        </Form.Item>
        <Form.Item name="category" label="Category">
          {!isAddCategoryInputShow ? (
            <Select
              options={categoryOptions}
              placeholder="Add a category to the project"
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Button
                    style={{ width: '100%' }}
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleShowAddCategoryInput}
                  >
                    New Category
                  </Button>
                </>
              )}
            />
          ) : (
            <Flex vertical gap={4}>
              <Input
                ref={categoryInputRef}
                placeholder="Enter a name for the category"
                value={categoryText}
                onChange={e => setCategoryText(e.currentTarget.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategoryItem(categoryText)}
              />
              <Typography.Text style={{ color: colors.lightGray }}>
                Hit enter to create!
              </Typography.Text>
            </Flex>
          )}
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea placeholder="Notes" />
        </Form.Item>
        <Form.Item
          name="client"
          label={
            <Typography.Text>
              Client{' '}
              <Tooltip title="You can manage clients under Settings ">
                <QuestionCircleOutlined />
              </Tooltip>
            </Typography.Text>
          }
        >
          <AutoComplete
            options={clientOptions}
            allowClear
            onSearch={handleClientSearch}
            placeholder="Type to search clients"
            dropdownRender={menu => (
              <>
                {loading && <Spin />}
                {menu}
              </>
            )}
          />
        </Form.Item>
        <Form.Item name="projectManager" label="Project Manager" layout="horizontal">
          <Button type="dashed" shape="circle" icon={<PlusCircleOutlined />} />
        </Form.Item>
        <Form.Item name="date" layout="horizontal">
          <Flex gap={8}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker />
            </Form.Item>
          </Flex>
        </Form.Item>
        <Form.Item name="estWorkingDays" label="Estimate working days">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="estManDays" label="Estimate man days">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="hrsPerDay" label="Hours per day">
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProjectDrawer;
