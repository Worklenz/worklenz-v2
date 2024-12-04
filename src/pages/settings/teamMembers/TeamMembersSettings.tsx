import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
  SyncOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  deleteMember,
  toggleCreateMemberDrawer,
  toggleMemberStatus,
  toggleUpdateMemberDrawer,
} from '../../../features/settings/member/memberSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { MemberType } from '../../../types/member.types';
import { colors } from '../../../styles/colors';
import UpdateMemberDrawer from '../../../features/settings/member/UpdateMemberDrawer';
import { useTranslation } from 'react-i18next';
import CustomAvatar from '../../../components/CustomAvatar';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const TeamMembersSettings = () => {
  // localization
  const { t } = useTranslation('teamMembersSettings');

  useDocumentTitle('Team Members');

  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // get currently selected member id
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // get all members lists from redux - add member reducer
  const owner = useAppSelector((state) => state.memberReducer.owner);
  const membersList = useAppSelector(
    (state) => state.memberReducer.membersList
  );
  const dispatch = useAppDispatch();

  // all members
  const allMembersList: MemberType[] = useMemo(
    () => [owner, ...membersList],
    [owner, membersList]
  );

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // function to get name
  const getMemberName = (memberId: string) => {
    const member = allMembersList.find(
      (member) => member.memberId === memberId
    );

    if (member?.memberName) {
      return member.memberName;
    } else return member?.memberEmail.split('@')[0];
  };

  // function to get colors according to the role
  const getColor = (role: 'owner' | 'member' | 'admin') => {
    switch (role) {
      case 'owner':
        return colors.skyBlue;
      case 'member':
        return colors.lightGray;
      case 'admin':
        return colors.yellow;
      default:
        return colors.darkGray;
    }
  };

  // used useMemo hook for re render the list when searching
  const filteredMembersData = useMemo(() => {
    return allMembersList.filter((item) =>
      (item.memberName || item.memberEmail)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [allMembersList, searchQuery]);

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'name',
      title: t('nameColumn'),
      sorter: (a, b) => a.name.length - b.name.length,
      onCell: (record) => ({
        onClick: () => {
          setSelectedMemberId(record.memberId);
          dispatch(toggleUpdateMemberDrawer());
        },
      }),
      render: (record: MemberType) => {
        const name = getMemberName(record.memberId) || '';

        return (
          <Typography.Text
            style={{
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
            }}
          >
            <CustomAvatar avatarName={name} />
            {name}
            {/* shows when activate status */}
            {record.isActivate ? (
              <Badge color={colors.limeGreen} />
            ) : (
              <Typography.Text
                style={{
                  color: colors.yellow,
                }}
              >
                {t('deactivatedText')}
              </Typography.Text>
            )}
          </Typography.Text>
        );
      },
    },
    {
      key: 'projects',
      title: t('projectsColumn'),
      sorter: (a, b) => a.projects - b.projects,
      onCell: (record) => ({
        onClick: () => {
          setSelectedMemberId(record.memberId);
          dispatch(toggleUpdateMemberDrawer());
        },
      }),
      render: (record: MemberType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
          }}
        >
          0
        </Typography.Text>
      ),
    },
    {
      key: 'memberEmail',
      title: t('emailColumn'),
      sorter: (a, b) => a.memberEmail.localeCompare(b.memberEmail),
      onCell: (record) => ({
        onClick: () => {
          setSelectedMemberId(record.memberId);
          dispatch(toggleUpdateMemberDrawer());
        },
      }),
      render: (record: MemberType) => (
        <div>
          <Typography.Text
            style={{
              color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
            }}
          >
            {record.memberEmail}
          </Typography.Text>
          {/* this one shown only for the pendinge members  */}
          {!record.isInivitationAccept && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t('pendingInvitationText')}
            </Typography.Text>
          )}
        </div>
      ),
    },
    {
      key: 'memberRole',
      title: t('teamAccessColumn'),
      sorter: (a, b) => a.memberRole.localeCompare(b.memberRole),
      render: (record: MemberType) => (
        <Flex gap={16} align="center">
          <Typography.Text
            style={{
              color: getColor(record.memberRole),
              textTransform: 'capitalize',
            }}
          >
            {record.memberRole}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      key: 'actionBtns',
      width: 120,
      render: (record: MemberType) =>
        record.memberRole !== 'owner' &&
        hoverRow === record.memberId && (
          <Flex gap={8} style={{ padding: 0 }}>
            <Tooltip title={t('editTooltip')} trigger={'hover'}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedMemberId(record.memberId);
                  dispatch(toggleUpdateMemberDrawer());
                }}
              />
            </Tooltip>

            <Tooltip
              title={
                record.isActivate
                  ? t('deactivateTooltip')
                  : t('activateTooltip')
              }
              trigger={'hover'}
            >
              <Popconfirm
                title={t('confirmActivateTitle')}
                icon={
                  <ExclamationCircleFilled
                    style={{
                      color: colors.vibrantOrange,
                    }}
                  />
                }
                okText={t('okText')}
                cancelText={t('cancelText')}
                onConfirm={() => dispatch(toggleMemberStatus(record))}
              >
                <Button
                  shape="default"
                  icon={<UserSwitchOutlined />}
                  size="small"
                />
              </Popconfirm>
            </Tooltip>

            <Tooltip title={t('deleteTooltip')} trigger={'hover'}>
              <Popconfirm
                title={t('confirmDeleteTitle')}
                icon={
                  <ExclamationCircleFilled
                    style={{
                      color: colors.vibrantOrange,
                    }}
                  />
                }
                okText={t('okText')}
                cancelText={t('cancelText')}
                onConfirm={() => dispatch(deleteMember(record.memberId))}
              >
                <Button
                  shape="default"
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Popconfirm>
            </Tooltip>
          </Flex>
        ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBlockEnd: 24 }}
      >
        <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
          {filteredMembersData.length}{' '}
          {filteredMembersData.length !== 1
            ? t('membersCountPlural')
            : t('memberCount')}
        </Typography.Title>

        <Flex
          gap={8}
          align="center"
          justify="flex-end"
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Tooltip title={t('pinTooltip')} trigger={'hover'}>
            <Button
              shape="circle"
              icon={<SyncOutlined />}
              onClick={() => handleRefresh()}
            />
          </Tooltip>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder={t('searchPlaceholder')}
            style={{ maxWidth: 232 }}
            suffix={<SearchOutlined />}
          />
          <Button
            type="primary"
            onClick={() => dispatch(toggleCreateMemberDrawer())}
          >
            {t('addMemberButton')}
          </Button>
        </Flex>
      </Flex>

      <Card style={{ width: '100%' }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Table
            className="custom-two-colors-row-table"
            columns={columns}
            dataSource={filteredMembersData}
            rowKey={(record) => record.memberId}
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 20,
              pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
              size: 'small',
            }}
            scroll={{
              x: 'max-content',
            }}
            onRow={(record) => {
              return {
                onMouseEnter: () => setHoverRow(record.memberId),
                onMouseLeave: () => setHoverRow(null),
                style: {
                  cursor: 'pointer',
                  height: 36,
                },
              };
            }}
          />
        )}
      </Card>

      {/* update member drawer ---> the add member drawer is in navbar */}
      <UpdateMemberDrawer selectedMemberId={selectedMemberId} />
    </div>
  );
};

export default TeamMembersSettings;
