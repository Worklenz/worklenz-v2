import { CommentOutlined, FireOutlined, HeartOutlined, ReadOutlined, RocketOutlined, SmileOutlined } from "@ant-design/icons";
import { Prompts, PromptsProps } from "@ant-design/x";
import { GetProp, Space } from "antd";

const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
      {icon}
      <span>{title}</span>
    </Space>
  );
export const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '2',
        description: 'I want to list down all Projects',
        icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
    {
    key: '1',
    description: 'I want to summarization of projects',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
},

];

export const firstScreenPrompts: PromptsProps['items'] = [
    {
      key: '1',
      label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
      description: 'What are you interested in?',
      children: [
        {
          key: '1-1',
          description: `What’s the project status?`,
        },
        {
          key: '1-2',
          description: `Where are the bottlenecks?`,
        },
        {
          key: '1-3',
          description: `Who’s performing best?`,
        },
      ],
    },
    {
      key: '2',
      label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Reporting Guide'),
      description: 'How to ask insightful questions:',
      children: [
        {
          key: '2-1',
          icon: <HeartOutlined />,
          description: `What tasks are high-risk?`,
        },
        {
          key: '2-2',
          icon: <SmileOutlined />,
          description: `Summarize the status of [Project].`,
        },
        {
          key: '2-3',
          icon: <CommentOutlined />,
          description: `Who has the most pending tasks?`,
        },
      ],
    },
    // {
    //   key: '3',
    //   label: renderTitle(<RocketOutlined style={{ color: '#722ED1' }} />, 'Start Creating'),
    //   description: 'How to start a new project?',
    //   children: [
    //     {
    //       key: '3-1',
    //       label: 'Fast Start',
    //       description: `Install Ant Design X`,
    //     },
    //     {
    //       key: '3-2',
    //       label: 'Online Playground',
    //       description: `Play on the web without installing`,
    //     },
    //   ],
    // },
  ];