import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Typography } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TinyEditor from '../../../tasks/taskCreationAndUpdate/shared/infoTab/text-editor/tiny-editor';
import { themeWiseColor } from '../../../../utils/themeWiseColor';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { colors } from '../../../../styles/colors';
import { TempServicesType } from '../../../../types/client-portal/temp-client-portal.types';

type ServiceDetailsStepProps = {
  setCurrent: (index: number) => void;
  service: TempServicesType;
  setService: (service: TempServicesType) => void;
};

const ServiceDetailsStep = ({
  setCurrent,
  service,
  setService,
}: ServiceDetailsStepProps) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<ReactNode | string>(
    'This is description'
  );
  const [images, setImages] = useState<string[] | null>([
    'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTNHXGJR2Nbpk5ntKmK7AXUjQXHNmPD2r1BZVj9ClQvMBpmzipx',
  ]);

  // trigger re-render for TinyEditor on theme change
  const [editorKey, setEditorKey] = useState<number>(0);

  // localization
  const { t } = useTranslation('client-portal-services');

  // get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [themeMode]);

  // function to handle next
  const handleNext = () => {
    setService({
      ...service,
      name: title,
      service_data: {
        ...service.service_data,
        description: description,
        images: images,
      },
    });
    setCurrent(1);
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: themeWiseColor(
          colors.deepLightGray,
          colors.darkGray,
          themeMode
        ),
        padding: 24,
      }}
      type="button"
    >
      <Flex vertical align="center" gap={4}>
        <PlusOutlined />
        <Typography.Text>{t('uploadImagePlaceholder')}</Typography.Text>
      </Flex>
    </button>
  );

  return (
    <Flex vertical gap={12}>
      <Flex
        vertical
        gap={32}
        style={{ height: 'calc(100vh - 460px)', overflowY: 'auto' }}
      >
        <Flex vertical gap={8}>
          <Typography.Text>{t('uploadImageLabel')}:</Typography.Text>

          <Flex gap={24}>
            {uploadButton}
            {uploadButton}
            {uploadButton}
            {uploadButton}
          </Flex>
        </Flex>

        <Flex vertical gap={8}>
          <Typography.Text>{t('serviceTitleLabel')}:</Typography.Text>
          <Input
            placeholder={t('serviceTitlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </Flex>

        <Flex vertical gap={8}>
          <Typography.Text>{t('serviceDescriptionLabel')}:</Typography.Text>
          <TinyEditor
            key={editorKey}
            init={{
              height: 300,
              menubar: false,
              branding: false,
              highlight_on_focus: false,
              resize: false,
              skin: 'dark',
              content_css: 'dark',
              plugins: [
                'anchor',
                'autolink',
                'image',
                'link',
                'lists',
                'searchreplace',
                'table',
                'wordcount',
              ],
              toolbar:
                'blocks |' +
                'bold italic underline strikethrough |  ' +
                '| numlist bullist link |' +
                'alignleft aligncenter alignright alignjustify',
              content_style: `body { font-size:14px;  font-family: 'Inter', sans-serif; background: ${themeWiseColor('#fff', '#141414', themeMode)}; 
            color: ${themeWiseColor('#141414', '#fff', themeMode)}; }`,
            }}
          />
        </Flex>
      </Flex>

      <Button
        type="primary"
        style={{ width: 'fit-content', alignSelf: 'flex-end' }}
        onClick={handleNext}
      >
        {t('nextButton')}
      </Button>
    </Flex>
  );
};

export default ServiceDetailsStep;
