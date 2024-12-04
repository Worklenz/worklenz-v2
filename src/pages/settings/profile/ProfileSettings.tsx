import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  Form,
  GetProp,
  Input,
  message,
  Tooltip,
  Typography,
  Upload,
  UploadProps,
} from 'antd';
import React, { useState } from 'react';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { changeUserName } from '../../../features/user/userSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  // get user data from redux - user reducer
  const userDetails = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();

  useDocumentTitle('Profile Settings');
  // localization
  const { t } = useTranslation('profileSettings');
  const [form] = Form.useForm();

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('uploadError'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('uploadSizeError'));
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <Flex align="center" gap={4}>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <Typography.Text>{t('upload')}</Typography.Text>
      </Flex>
    </button>
  );

  // this fuction handle form submit
  const handleFormSubmit = (values: any) => {
    console.log(values.name);
    dispatch(changeUserName(values.name));
    message.success('Name changed successfully!');
  };

  return (
    <Card style={{ width: '100%' }}>
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        initialValues={{
          name: userDetails.name,
          email: userDetails.email,
        }}
        style={{ width: '100%', maxWidth: 350 }}
      >
          <Form.Item>
        <Tooltip title='Click to upload an avata' placement="topLeft">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}

            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
        </Tooltip>
          </Form.Item>
        <Form.Item
          name="name"
          label={t('nameLabel')}
          rules={[
            {
              required: true,
              message: t('nameRequiredError'),
            },
          ]}
        >
          <Input style={{ borderRadius: 4 }} />
        </Form.Item>
        <Form.Item
          name="email"
          label={t('emailLabel')}
          rules={[
            {
              required: true,
              message: t('emailRequiredError'),
            },
          ]}
        >
          <Input style={{ borderRadius: 4 }} disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('saveChanges')}
          </Button>
        </Form.Item>
      </Form>

      <Flex vertical>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {t('profileJoinedText')}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {t('profileLastUpdatedText')}
        </Typography.Text>
      </Flex>
    </Card>
  );
};

export default ProfileSettings;
