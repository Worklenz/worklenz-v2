import {
  EditOutlined,
  EnterOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';
import { Button, Card, Input, notification, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import OrganizationAdminsTable from './OrganizationAdminsTable';
import TextArea from 'antd/es/input/TextArea';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../app/store';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const Overview: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [name, setName] = useState('Raveesha Dilanka');
  const [number, setNumber] = useState('');
  const [isEditableContactNumber, setIsEditableContactNumber] = useState(false);

  const themeMode = useAppSelector(
    (state: RootState) => state.themeReducer.mode
  );
  const { t } = useTranslation('overview');

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleEditContactNumber = () => {
    setIsEditableContactNumber(true);
  };

  const [api, contextHolder] = notification.useNotification()

  const handleBlur = () => {
    setIsEditable(false);
    if (name.trim() === '') {
      api.open({
        message: '',
        description: 'Name is required',
        duration: 4.5,
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setName(e.target.value);
  };

  const handleContactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const filteredValue = inputValue.replace(/(?!^\+)[^0-9]/g, '');

    if (inputValue.startsWith('+')) {
      if (filteredValue.length > 1) {
        setNumber(filteredValue);
      } else if (filteredValue.length === 1 && inputValue.charAt(0) === '+') {
        setNumber('+');
      }
    } else {
      setNumber(filteredValue);
    }
  };

  const handleContactNumberBlur = () => {
    setIsEditableContactNumber(false);
  };

  const addContactNumber = () => {
    setIsEditableContactNumber(true);
  };

  return (
    <div style={{ width: '100%' }}>
      {contextHolder}
      <PageHeader
        title={<span>{t('overview')}</span>}
        style={{ padding: '16px 0' }}
      />
      <Card>
        <div
          style={{
            marginTop: 0,
            marginBottom: '0.5rem',
            color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {t('name')}
        </div>
        <div style={{ paddingTop: '8px' }}>
          <div style={{ marginBottom: '8px' }}>
            {isEditable ? (
              <div style={{ position: 'relative' }}>
                <TextArea
                  style={{
                    height: '32px',
                    paddingRight: '40px',
                  }}
                  onPressEnter={handleBlur}
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleBlur}
                />
                <Button
                  icon={<EnterOutlined style={{ color: '#00000073' }} />}
                  type="link"
                  style={{
                    position: 'absolute',
                    right: '1px',
                  }}
                  onClick={handleBlur}
                />
              </div>
            ) : (
              <Text
                style={{
                  color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                }}
              >
                {name}{' '}
                <Tooltip title="Edit">
                  <Button
                    onClick={handleEdit}
                    size="small"
                    type="link"
                    icon={<EditOutlined />}
                  />
                </Tooltip>
              </Text>
            )}
          </div>
        </div>
      </Card>

      <div style={{ marginTop: '1.5rem' }} />

      <Card>
        <div
          style={{
            marginTop: 0,
            marginBottom: '0.5rem',
            color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {t('owner')}
        </div>
        <div style={{ paddingTop: '8px' }}>
          <div style={{ marginBottom: '8px' }}>
            <Text
              style={{
                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
              }}
            >
              Raveesha Dilanka
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text
            style={{
              color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
            }}
          >
            <span style={{ marginRight: '8px' }}>
              <Tooltip title='Email Address'>
                <MailOutlined />
              </Tooltip>
            </span>
            raveeshadilanka1999@gmail.com
          </Text>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Tooltip title="Contact Number">
            <span style={{ marginRight: '8px' }}>
              <PhoneOutlined />
            </span>
          </Tooltip>
          {isEditableContactNumber ? (
            <Input
              onChange={handleContactNumber}
              onPressEnter={handleContactNumberBlur}
              onBlur={handleContactNumberBlur}
              style={{ width: '200px' }}
              value={number}
              type="text"
              maxLength={15}
            />
          ) : number === '' ? (
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={addContactNumber}
            >
              {t('contactNumber')}
            </Button>
          ) : (
            <Text
              style={{
                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
              }}
            >
              {number}
              <Tooltip title="Edit">
                <Button
                  onClick={handleEditContactNumber}
                  size="small"
                  type="link"
                  icon={<EditOutlined />}
                />
              </Tooltip>
            </Text>
          )}
        </div>
      </Card>

      <div style={{ marginTop: '1.5rem' }} />

      <Card>
        <div
          style={{
            marginTop: 0,
            marginBottom: '0.5rem',
            color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {t('admins')}
        </div>
        <OrganizationAdminsTable />
      </Card>
    </div>
  );
};

export default Overview;
