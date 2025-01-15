import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';
import { Button, Card, Flex, Input, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import UsersTable from '@/components/admin-center/users/users-table/users-table';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { adminCenterApiService } from '@/api/admin-center/admin-center.api.service';
import { IOrganizationUser } from '@/types/admin-center/admin-center.types';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import logger from '@/utils/errorLogger';

const Users: React.FC = () => {
  const { t } = useTranslation('admin-center/users');

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IOrganizationUser[]>([]);
  const [requestParams, setRequestParams] = useState({
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sort: 'name',
    order: 'desc',
    searchTerm: '',
  });

  const themeMode = useAppSelector((state: RootState) => state.themeReducer.mode);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminCenterApiService.getOrganizationUsers(requestParams);
      if (res.done) {
        setUsers(res.body.data ?? []);
        setRequestParams(prev => ({ ...prev, total: res.body.total ?? 0 }));
      }
    } catch (error) {
      logger.error('Error fetching users',  error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [requestParams.searchTerm]);

  return (
    <div style={{ width: '100%' }}>
      <PageHeader title={<span>{t('title')}</span>} style={{ padding: '16px 0' }} />
      <PageHeader
        style={{
          paddingLeft: 0,
          paddingTop: 0,
          paddingBottom: '16px',
        }}
        subTitle={
          <span
            style={{
              color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
              fontWeight: 500,
              fontSize: '16px',
            }}
          >
           {requestParams.total} {t('subTitle')}
          </span>
        }
        extra={
          <Flex gap={8} align="center">
            <Tooltip title={t('refresh')}>
              <Button
                shape="circle"
                icon={<SyncOutlined spin={isLoading} />}
                onClick={() => fetchUsers()}
              />
            </Tooltip>
            <Input
              placeholder={t('placeholder')}
              suffix={<SearchOutlined />}
              type="text"
              value={requestParams.searchTerm}
              onChange={e => setRequestParams(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </Flex>
        }
      />
      <Card>
        <UsersTable users={users} t={t} loading={isLoading} />
      </Card>
    </div>
  );
};

export default Users;
