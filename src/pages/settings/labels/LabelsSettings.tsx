import {
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';

import PinRouteToNavbarButton from '../../../components/PinRouteToNavbarButton';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { LabelType } from '../../../types/label.type';
import { colors } from '../../../styles/colors';
import { deleteLabel } from '../../../features/settings/label/labelSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import ColorChangedLabel from '../../../components/taskListCommon/labelsSelector/color-changed-label';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const LabelsSettings = () => {
  // localization
  const { t } = useTranslation('labelsSettings');
  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  // get label data from label slice
  const labelList = useAppSelector((state) => state.labelReducer.labelList);
  const dispatch = useAppDispatch();

  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  useDocumentTitle('Manage Labels');

  // used useMemo hook for re render the list when searching
  const filteredLabelsData = useMemo(() => {
    return labelList.filter((item) =>
      item.labelName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [labelList, searchQuery]);

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'label',
      title: t('labelColumn'),
      render: (record: LabelType) => <ColorChangedLabel label={record} />,
    },
    {
      key: 'associatedTask',
      title: t('associatedTaskColumn'),
      render: () => <Typography.Text>0</Typography.Text>,
    },
    {
      key: 'actionBtns',
      width: 60,
      render: (record: LabelType) =>
        hoverRow === record.labelId && (
          <Popconfirm
            title={t('deleteConfirmationTitle')}
            icon={
              <ExclamationCircleFilled
                style={{ color: colors.vibrantOrange }}
              />
            }
            okText={t('deleteConfirmationOk')}
            cancelText={t('deleteConfirmationCancel')}
            onConfirm={() => dispatch(deleteLabel(record.labelId))}
          >
            <Tooltip title="Delete">
              <Button shape="default" icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        ),
    },
  ];

  return (
    <Card
      style={{ width: '100%' }}
      title={
        <Flex justify="flex-end">
          <Flex
            gap={8}
            align="center"
            justify="flex-end"
            style={{ width: '100%', maxWidth: 400 }}
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder={t('searchPlaceholder')}
              style={{ maxWidth: 232 }}
              suffix={<SearchOutlined />}
            />

            <Tooltip title={t('pinTooltip')} trigger={'hover'}>
              {/* this button pin this route to navbar  */}
              <PinRouteToNavbarButton
                name="labels"
                path="/worklenz/settings/labels"
              />
            </Tooltip>
          </Flex>
        </Flex>
      }
    >
      <Table
        locale={{
          emptyText: <Typography.Text>{t('emptyText')}</Typography.Text>,
        }}
        className="custom-two-colors-row-table"
        dataSource={filteredLabelsData}
        columns={columns}
        rowKey={(record) => record.labelId}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
          size: 'small',
        }}
        onRow={(record) => {
          return {
            onMouseEnter: () => setHoverRow(record.labelId),
            onMouseLeave: () => setHoverRow(null),
            style: {
              cursor: 'pointer',
              height: 36,
            },
          };
        }}
      />
    </Card>
  );
};

export default LabelsSettings;
