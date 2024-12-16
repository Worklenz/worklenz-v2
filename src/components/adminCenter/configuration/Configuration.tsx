import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Select,
} from 'antd';
import React from 'react';
import { RootState } from '../../../app/store';
import { useAppSelector } from '../../../hooks/useAppSelector';

const Configuration: React.FC = () => {
  const themeMode = useAppSelector(
    (state: RootState) => state.themeReducer.mode
  );

  const name = 'Raveesha Dilanka';
  const emailAddress = 'raveeshadilanka1999@gmail.com';

  const [api, contextHolder] = notification.useNotification();

  const handleSave = () => {
    api.open({
      message: '',
      description: 'Configuration Updated',
      duration: 4.5,
    });
  };

  const { Option } = Select;

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
    'sdasd',
    'dasdas',
    'sdasdas',
    'sdasd',
    // Add more countries as needed
  ];

  // Map countries to an array of objects with label and value
  const countryOptions = countries.map((country) => ({
    label: country,
    value: country,
  }));

  return (
    <div>
      {contextHolder}
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
            Billing Details
          </span>
        }
        style={{ marginTop: '16px' }}
      >
        <Form
          initialValues={{
            name: name,
            emailAddress: emailAddress,
            companyName: name,
          }}
        >
          <Row>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="name"
                label="Name"
                layout="vertical"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="emailAddress"
                label="Email Address"
                layout="vertical"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Name" disabled />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="contactNumber"
                label="Contact Number"
                layout="vertical"
                rules={[
                  {
                    pattern: /^\d{10}$/,
                    message: 'Phone number must be exactly 10 digits',
                  },
                ]}
              >
                <Input
                  placeholder="Phone Number"
                  maxLength={10}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement; // Type assertion to access 'value'
                    input.value = input.value.replace(/[^0-9]/g, ''); // Restrict non-numeric input
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ margin: '16px 0' }}>
            <span
              style={{
                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                fontWeight: 600,
                fontSize: '16px',
                display: 'flex',
                gap: '4px',
              }}
            >
              Company Details
            </span>
          </Divider>

          <Row>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="companyName"
                label="Company Name"
                layout="vertical"
              >
                <Input placeholder="Company Name" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="addressLine01"
                label="Address Line 01"
                layout="vertical"
              >
                <Input placeholder="Address Line 01" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="addressLine02"
                label="Address Line 02"
                layout="vertical"
              >
                <Input placeholder="Address Line 02" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              span={8}
              style={{
                padding: '0 12px',
                height: '86px',
                scrollbarColor: 'red',
              }}
            >
              <Form.Item name="country" label="Country" layout="vertical">
                <Select
                  dropdownStyle={{ maxHeight: 256, overflow: 'auto' }}
                  placement="topLeft"
                  showSearch
                  placeholder="Country"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                  options={countryOptions}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item name="city" label="City" layout="vertical">
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item name="state" label="State" layout="vertical">
                <Input placeholder="State" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{ padding: '0 12px', height: '86px' }}>
              <Form.Item
                name="postalCode"
                label="Postal Code"
                layout="vertical"
              >
                <Input placeholder="Postal Code" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ paddingLeft: '12px' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={handleSave}>
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Configuration;
