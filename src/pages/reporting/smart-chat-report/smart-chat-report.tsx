import React, { useEffect, useState } from 'react';
import { EllipsisOutlined, OpenAIFilled, ShareAltOutlined } from '@ant-design/icons';
import { Button, Flex, GetProp, Space, Typography } from 'antd';
import { Bubble, BubbleProps, Sender, Welcome } from '@ant-design/x';
import Markdownit from 'markdown-it';
import { useAppSelector } from '@/hooks/useAppSelector';
import { reportingApiService } from '@/api/reporting/reporting.api.service';
import logger from '@/utils/errorLogger';
import { IRPTTeam } from '@/types/reporting/reporting.types';
import { IChatMessage } from '@/types/aiChat/ai-chat.types';
import { Prompts } from '@ant-design/x';
import { authApiService } from '@/api/auth/auth.api.service';
import { firstScreenPrompts, senderPromptsItems } from './prompt';
import AssistantIcon from '../../../assets/icons/worklenz_ai_light.png';
import welcomeScreenIcon from '../../../assets/icons/worklenz_ai.png';
const md = Markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
    <Typography>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
        <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
);
const roles: GetProp<typeof Bubble.List, 'roles'> = {
    assistant: {
        placement: 'start',
        typing: { step: 1, interval: 50 },
        variant: 'outlined',
        avatar: { icon: <img src={AssistantIcon} alt="Assistant" style={{ width: 30, height: 30}} />
    },
        messageRender: renderMarkdown,
        styles: {
            content: {
                borderRadius: 16,
                marginRight: '1rem'
            },
        },
    },
    user: {
        placement: 'end',
        variant: 'outlined',
        styles: {
            content: {
                borderRadius: 16,
                marginRight: '1rem'
            },
        },
    },
};

const SmartChatReport = () => {
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [user, setUser] = useState({});
    const [teams, setTeams] = useState<IRPTTeam[]>([]);
    const [selectedTeam, setselectedTeam] = useState({});
    const [organization, setOrganization] = useState({});
    const [showPrompts, setShowPrompts] = useState(chatMessages.length ===0);
    const [currentDate, setCurrentDate] = useState('');
    const now_date = new Date().toDateString();
    const includeArchivedProjects = useAppSelector(state => state.reportingReducer.includeArchivedProjects);

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        // onRequest(info.data.description as string);
        setMessageInput(info.data.description as string);
        handleSend(info.data.description as string);
        setShowPrompts(false);
    };

    const handleSend = async (messageInput: string) => {
        if (!messageInput.trim() || loading) return;

        const userMessage: IChatMessage = {
            role: "user",
            content: messageInput
        };
        setShowPrompts(false)
        setChatMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setMessageInput('');
        try {

            const updatedChatMessages = [...chatMessages, userMessage];
            const requestBody = {
                chat: updatedChatMessages,
                data: {
                    org: JSON.stringify({
                        current_date: currentDate,
                        organization_name: organization,
                        user_name: user,
                    }),
                    teams: JSON.stringify(teams),
                    selectedTeam: JSON.stringify(selectedTeam),
                },
            };
            const response = await reportingApiService.getChat(updatedChatMessages);
            const responseText = `${response.body.content}`.trim();
            setIsTyping(true);
            const aiMessage: IChatMessage = {
                role: "assistant",
                content: responseText
            };
            setChatMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);

        } catch (error) {
            logger.error('handleSend', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDataAndSetChat = async () => {
            setLoading(true);
            try {
                
                setCurrentDate(now_date);
                console.log("Current Date:", now_date);
                // const storedSessionId = localStorage.getItem('worklenz.sid');
                // console.log("Stored Session ID:", storedSessionId);
                // Ensure all data is fetched before setting chat
                // const requestBody = {
                //     data: {
                //         org: JSON.stringify(infoResponse.body || {}),
                //         teams: JSON.stringify(teamsResponse.body || []),
                //         selectedTeam: JSON.stringify(membersResponse.body || {}),
                //     },
                // };

                // console.log("SetChat Request Body:", requestBody);
                // const response = await apiAiChatClient.post('/chat-init', requestBody);
                // console.log("SetChat Response:", response.data);

            } catch (error) {
                logger.error('fetchDataAndSetChat', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataAndSetChat();
    }, [includeArchivedProjects]);

    return (
        <Flex vertical
            className="ant-col ant-col-xxl-10 ant-col-xxl-offset-6"
        >
            <Flex gap="middle"
                style={{ height: '70vh', overflowY: 'auto' }}
                vertical>
                <Bubble.List
                    items={chatMessages.length > 0 ? chatMessages : [{ variant: 'borderless' }]}
                    roles={roles}
                />
                { showPrompts && <Welcome
        variant="borderless"
        icon= {<img src={welcomeScreenIcon} alt="Assistant" style={{ width: 55, height: 55}} />}
        title="Hello, I'm Worklenz AI Assistant"
        description="Base on your Oraganization, Create Summary reports, a better intelligent vision."
      />

                }
                <Flex justify='center' align='center'>
                    {
                        showPrompts &&
                        <Prompts
                            style={{ alignItems: "center" }}
                            items={firstScreenPrompts} onItemClick={onPromptsItemClick} />
                    }
                </Flex>

            </Flex>
            <Flex justify='center' align='flex-end' style={{ fontSize: '5em' }} vertical >
                {
                    (chatMessages.length < 3) &&
                    <Prompts
                        styles={{
                            list: {},
                            item: { borderRadius: 50 },
                        }}
                        items={senderPromptsItems} onItemClick={onPromptsItemClick} />
                }
            </Flex>

            <Flex justify='center' align='flex-end' style={{ paddingTop: '1rem' }} vertical >
                <Sender
                    loading={loading}
                    placeholder='Type your message here...'
                    value={messageInput}
                    onChange={setMessageInput}
                    onSubmit={() => {
                        if (chatMessages.length > 100) {
                            alert("Message rate limit exceeded");
                            return;
                        }
                        handleSend(messageInput);
                    }}
                />
            </Flex>
        </Flex>
    );
};

export default SmartChatReport;
