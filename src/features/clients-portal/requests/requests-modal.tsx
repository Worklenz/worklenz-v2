import {
  Card,
  Flex,
  Modal,
  Radio,
  Select,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleRequestModal } from './requests-slice';
import { colors } from '../../../styles/colors';
import { DownOutlined } from '@ant-design/icons';

const RequestsModal = () => {
  // localization
  const { t: t1 } = useTranslation('client-portal-requests');
  const { t: t2 } = useTranslation('client-portal-common');

  const { isRequestModalOpen, selectedRequestNo, requests } = useAppSelector(
    (state) => state.clientsPortalReducer.requestsReducer
  );

  const dispatch = useAppDispatch();

  // filter the seleted request
  const selectedRequest = useMemo(() => {
    return requests.find(
      (request: any) => request.req_no === selectedRequestNo
    );
  }, [requests, selectedRequestNo]);

  const items: TabsProps['items'] = [
    {
      key: 'submission',
      label: t1('submissionTab'),
      children: (
        <Flex
          vertical
          gap={24}
          style={{ height: 'calc(100vh - 400px)', overflowY: 'auto' }}
        >
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontWeight: 600 }}>
              {t1('projectTitle')}
            </Typography.Text>
            <Typography.Text>Animation video for worklenz</Typography.Text>
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontWeight: 600 }}>
              {t1('desiredLength')}
            </Typography.Text>
            <Typography.Text>5</Typography.Text>
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontWeight: 600 }}>
              {t1('preferredVideoStyle')}
            </Typography.Text>
            <Typography.Text>Animation</Typography.Text>
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontWeight: 600 }}>
              {t1('script')}
            </Typography.Text>
            <Typography.Text>Animation</Typography.Text>
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontWeight: 600 }}>
              {t1('voiceOver')}
            </Typography.Text>
            <Radio.Group
              name="radiogroup"
              defaultValue={'option1'}
              options={[
                { value: 'option1', label: t1('iWillProvide') },
                { value: 'option2', label: t1('needThatOneToo') },
              ]}
            />
          </Flex>
          <Flex vertical gap={8}>
            <Typography.Text style={{ fontWeight: 600 }}>
              {t1('samples')}
            </Typography.Text>
            <img
              src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTNHXGJR2Nbpk5ntKmK7AXUjQXHNmPD2r1BZVj9ClQvMBpmzipx"
              alt="sample"
              style={{ width: 150, height: 150, objectFit: 'cover' }}
            />
          </Flex>
        </Flex>
      ),
    },
    {
      key: 'chat',
      label: t1('chatTab'),
      children: <div>chats</div>,
    },
  ];

  return (
    <Modal
      open={isRequestModalOpen}
      title={
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Typography.Title level={5}>
            {t1('reqNoText')}: {selectedRequest?.req_no}
          </Typography.Title>

          <Select
            value={selectedRequest?.status}
            options={[
              { label: t2('pendingStatus'), value: 'pending' },
              { label: t2('inProgressStatus'), value: 'inProgress' },
              { label: t2('acceptedStatus'), value: 'accepted' },
            ]}
            onChange={(value) => console.log(value)}
            variant="borderless"
            labelRender={(value) => (
              <Typography.Text style={{ color: colors.skyBlue }}>
                {value.label}
              </Typography.Text>
            )}
            suffixIcon={<DownOutlined style={{ color: colors.skyBlue }} />}
          />
        </Flex>
      }
      width={1200}
      onCancel={() => dispatch(toggleRequestModal(null))}
      closeIcon={null}
      footer={null}
    >
      <Card>
        <Tabs
          defaultActiveKey="submission"
          items={items}
          style={{
            height: 'calc(100vh - 320px)',
            overflow: 'hidden',
          }}
        />
      </Card>
    </Modal>
  );
};

export default RequestsModal;
