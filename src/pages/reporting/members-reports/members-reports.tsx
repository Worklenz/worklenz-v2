import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Flex,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import MembersReportsTable from './membersReportsTable.tsx/MembersReportsTable';
import TimeWiseFilter from './TimeWiseFilter';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchMembersData } from '@features/reporting/membersReports/membersReportsSlice';
import { useTranslation } from 'react-i18next';
import CustomSearchbar from '@components/CustomSearchbar';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import CustomPageHeader from '../page-header/custom-page-header';

const MembersReports = () => {
  const [searchQuery, setSearhQuery] = useState<string>('');

  useDocumentTitle('Reporting - Members');

  // localization
  const { t } = useTranslation('reporting-members');

  const dispatch = useAppDispatch();

  // get members list and loading state from members repors reducer
  const { membersList, isLoading } = useAppSelector(
    (state) => state.membersReportsReducer
  );

  // load data from members reports reducer
  useEffect(() => {
    dispatch(fetchMembersData());
  }, [dispatch]);

  return (
    <Flex vertical>
      <CustomPageHeader
        title={`Members`}
        children={
          <Space>
            <Button>
              <Checkbox />
              <Typography.Text>{t('includeArchivedButton')}</Typography.Text>
            </Button>

            <TimeWiseFilter />

            <Dropdown menu={{ items: [{ key: '1', label: t('excelButton') }] }}>
              <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                {t('exportButton')}
              </Button>
            </Dropdown>
          </Space>
        }
      />

      <Card
        title={
          <Flex justify="flex-end">
            {/* searchbar  */}
            <CustomSearchbar
              placeholderText={t('searchByNameInputPlaceholder')}
              searchQuery={searchQuery}
              setSearchQuery={setSearhQuery}
            />
          </Flex>
        }
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <MembersReportsTable membersList={membersList} />
        )}
      </Card>
    </Flex>
  );
};

export default MembersReports;
