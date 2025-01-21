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
    key: '1',
    description: 'Current Team Summary',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
},
{
    key: '2',
    description: 'List of Projects',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />,
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
          description: `What's new in X?`,
        },
        {
          key: '1-2',
          description: `What's AGI?`,
        },
        {
          key: '1-3',
          description: `Where is the doc?`,
        },
      ],
    },
    {
      key: '2',
      label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
      description: 'How to design a good product?',
      children: [
        {
          key: '2-1',
          icon: <HeartOutlined />,
          description: `Know the well`,
        },
        {
          key: '2-2',
          icon: <SmileOutlined />,
          description: `Set the AI role`,
        },
        {
          key: '2-3',
          icon: <CommentOutlined />,
          description: `Express the feeling`,
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