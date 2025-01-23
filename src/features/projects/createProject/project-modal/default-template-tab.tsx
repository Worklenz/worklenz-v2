import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Flex,
  List,
  Menu,
  MenuProps,
  Tag,
  Typography,
} from 'antd';
import { useAppSelector } from '../../../../hooks/useAppSelector';

const DefaultTemplateTab = () => {
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const { t: t1 } = useTranslation('templateDrawer');
  // localization
  const { t: t2 } = useTranslation('create-project-modal');

  type MenuItem = Required<MenuProps>['items'][number];

  const data = [
    'Testing and Verification',
    'Bug Prioritization',
    'Bug reporting',
    'Bug Assignment',
    'Bug Closure',
    'Documentation',
    'Reporting',
  ];

  const items: MenuItem[] = [
    { key: '1', label: t1('bugTracking') },
    { key: '2', label: t1('construction') },
    { key: '3', label: t1('designCreative') },
    { key: '4', label: t1('education') },
    { key: '5', label: t1('finance') },
    { key: '6', label: t1('hrRecruiting') },
    { key: '7', label: t1('informationTechnology') },
    { key: '8', label: t1('legal') },
    { key: '9', label: t1('manufacturing') },
    { key: '10', label: t1('marketing') },
    { key: '11', label: t1('nonprofit') },
    { key: '12', label: t1('personalUse') },
    { key: '13', label: t1('salesCRM') },
    { key: '14', label: t1('serviceConsulting') },
    { key: '15', label: t1('softwareDevelopment') },
  ];

  const onClick = () => {};

  return (
    <>
      <div>
        <Flex>
          {/* Menu Area============================================================= */}
          <div
            style={{
              width: 256,
              height: 'calc(100vh - 460px)',
              overflowY: 'auto',
            }}
          >
            <Menu
              onClick={onClick}
              style={{ width: '100%' }}
              defaultSelectedKeys={['1']}
              mode="inline"
              items={items}
            />
          </div>
          {/* Content Area========================================================== */}

          <div
            style={{
              flex: 1,
              padding: '12px 24px',
              height: 'calc(100vh - 460px)',
              overflowY: 'auto',
            }}
          >
            {/* Placeholder for content */}
            <Typography.Title level={4}>Details</Typography.Title>
            <img
              src="https://worklenz.s3.amazonaws.com/project-template-gifs/bug-tracking.gif"
              alt="preview"
              // style={{ width: '100%' }}
            />
            <div>
              {/* Description */}
              <div
                style={{
                  display: 'flex',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '120px',
                    minWidth: '120px',
                  }}
                >
                  <Typography.Text style={{ fontWeight: 500 }}>
                    {t1('description')}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text>
                    The “Bug Tracking” project template is a versatile solution
                    meticulously designed to streamline and enhance the bug
                    management processes of businesses across diverse
                    industries. This template is especially valuable for
                    organizations that rely on software development, IT
                    services, or digital product management. It provides a
                    structured and efficient approach to tracking, resolving,
                    and improving software issues.
                  </Typography.Text>
                </div>
              </div>

              {/* Phase */}
              <div
                style={{
                  display: 'flex',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '120px',
                    minWidth: '120px',
                  }}
                >
                  <Typography.Text style={{ fontWeight: 500 }}>
                    {t1('phase')}
                  </Typography.Text>
                </div>
                <div>
                  <Tag
                    color="#75c9c069"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Incoming
                  </Tag>
                  <Tag
                    color="#3b7ad469"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Backlog
                  </Tag>
                  <Tag
                    color="#7781ca69"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Development work
                  </Tag>
                  <Tag
                    color="#bf494969"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Resolved
                  </Tag>
                  <Tag
                    color="#ff9c3c69"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Testing & Review
                  </Tag>
                </div>
              </div>

              {/* Statuses */}
              <div
                style={{
                  display: 'flex',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '120px',
                    minWidth: '120px',
                  }}
                >
                  <Typography.Text style={{ fontWeight: 500 }}>
                    {t1('statuses')}
                  </Typography.Text>
                </div>
                <div>
                  <Tag
                    color="#a9a9a969"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    To Do
                  </Tag>
                  <Tag
                    color="#70a6f369"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Doing
                  </Tag>
                  <Tag
                    color="#70a6f369"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Done
                  </Tag>
                </div>
              </div>

              {/* Priorities */}
              <div
                style={{
                  display: 'flex',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '120px',
                    minWidth: '120px',
                  }}
                >
                  <Typography.Text style={{ fontWeight: 500 }}>
                    {t1('priorities')}
                  </Typography.Text>
                </div>
                <div>
                  <Tag
                    color="#75c99769"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Low
                  </Tag>
                  <Tag
                    color="#fbc84c69"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Medium
                  </Tag>
                  <Tag
                    color="#f3707069"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    High
                  </Tag>
                </div>
              </div>

              {/* Labels */}
              <div
                style={{
                  display: 'flex',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '120px',
                    minWidth: '120px',
                  }}
                >
                  <Typography.Text style={{ fontWeight: 500 }}>
                    {t1('labels')}
                  </Typography.Text>
                </div>
                <div>
                  <Tag
                    color="#cbbc7869"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    UI/UX Bug
                  </Tag>
                  <Tag
                    color="#7781ca69"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Ready for Dev
                  </Tag>
                  <Tag
                    color="#cb987869"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Regression
                  </Tag>
                  <Tag
                    color="#154c9b69"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Critical
                  </Tag>
                  <Tag
                    color="#905b3969"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Awaiting review
                  </Tag>
                  <Tag
                    color="#cbc8a169"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Fixed
                  </Tag>
                  <Tag
                    color="#aacb7869"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Duplicate
                  </Tag>
                  <Tag
                    color="#ee87c569"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Documentation
                  </Tag>
                  <Tag
                    color="#80ca7969"
                    style={{
                      color: 'black',
                      marginBottom: '8px',
                    }}
                  >
                    Fixing
                  </Tag>
                </div>
              </div>

              {/* Tasks */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '120px',
                    minWidth: '120px',
                  }}
                >
                  <Typography.Text style={{ fontWeight: 500 }}>
                    {t1('tasks')}
                  </Typography.Text>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <List
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item>
                        <Typography.Text>{item}</Typography.Text>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </Flex>
      </div>

      {/* footer  */}
      <Divider style={{ marginBlock: 16 }} />
      <Flex justify="flex-end">
        <Button type="primary">{t2('createButton')}</Button>
      </Flex>
    </>
  );
};

export default DefaultTemplateTab;
