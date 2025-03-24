import React from 'react';
import { Button, Checkbox, Dropdown, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CustomPageHeader from '../../page-header/custom-page-header';
import TimeWiseFilter from '../../../../components/reporting/time-wise-filter';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setArchived } from '@/features/reporting/time-reports/time-reports-overview.slice';

interface headerState {
  title: string;
  export: () => void;
}

const TimeReportingRightHeader: React.FC<headerState> = ({ title, export: exportFn }) => {
  const { t } = useTranslation('time-report');
  const dispatch = useAppDispatch();
  const { archived } = useAppSelector(state => state.timeReportsOverviewReducer);

  return (
    <CustomPageHeader
      title={title}
      children={
        <Space>
          <Button>
            <Checkbox checked={archived} onChange={e => dispatch(setArchived(e.target.checked))}>
              <Typography.Text>{t('includeArchivedProjects')}</Typography.Text>
            </Checkbox>
          </Button>
          <TimeWiseFilter />
          <Dropdown menu={{ items: [{ key: '1', label: 'Excel', onClick: exportFn }] }}>
            <Button type="primary" icon={<DownOutlined />} iconPosition="end">
              {t('export')}
            </Button>
          </Dropdown>
        </Space>
      }
    />
  );
};

export default TimeReportingRightHeader;
