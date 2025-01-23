import React, { useMemo, useState } from 'react';
import { fetchData } from '../../../../utils/fetchData';
import { Button, Divider, Flex, List, Typography } from 'antd';
import CustomSearchbar from '../../../../components/CustomSearchbar';
import { useTranslation } from 'react-i18next';

const MyTemplateTab = () => {
  const [myTemplates, setMyTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  //   localization
  const { t } = useTranslation('create-project-modal');

  useMemo(() => {
    fetchData('/ProjectTemplates.json', setMyTemplates);
  }, []);

  const filteredTemplates = myTemplates?.filter((template) =>
    template.name.includes(searchQuery)
  );

  return (
    <>
      <Flex vertical gap={12}>
        <CustomSearchbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholderText={t('seachByTemplateNamePlaceholder')}
        />

        <List
          bordered
          style={{ height: 'calc(100vh - 500px)', overflowY: 'auto' }}
        >
          {filteredTemplates.length > 0 ? (
            filteredTemplates?.map((template) => (
              <List.Item key={template.id}>{template.name}</List.Item>
            ))
          ) : (
            <Flex justify="center" style={{ padding: 24 }}>
              <Typography.Text>{t('noTemplatesFound')}</Typography.Text>
            </Flex>
          )}
        </List>
      </Flex>

      {/* footer  */}
      <Divider style={{ marginBlock: 16 }} />
      <Flex justify="flex-end">
        <Button type="primary">{t('createButton')}</Button>
      </Flex>
    </>
  );
};

export default MyTemplateTab;
