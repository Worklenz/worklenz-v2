import React, { useEffect, useState } from 'react';
import { OpenAIFilled } from '@ant-design/icons';
import { Flex, GetProp, Typography } from 'antd';
import { Bubble, BubbleProps, Sender } from '@ant-design/x';
import Markdownit from 'markdown-it';
import { useAppSelector } from '@/hooks/useAppSelector';
import { reportingApiService } from '@/api/reporting/reporting.api.service';
import logger from '@/utils/errorLogger';
import { IRPTTeam } from '@/types/reporting/reporting.types';
import { IChatMessage } from '@/types/aiChat/ai-chat.types';
import { Prompts } from '@ant-design/x';
import apiAiChatClient from '@/api/api-aichat-client';
import { authApiService } from '@/api/auth/auth.api.service';
import { useChatScroll } from './smart-chat-report-styles';
import { firstScreenPrompts, senderPromptsItems } from './prompt';

const md = Markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
    <Typography>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
        <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
);
const initialMessages: IChatMessage[] = [
    {
        role: "assistant",
        content: "How can I help you today with worklenz ?"
    },
];
const roles: GetProp<typeof Bubble.List, 'roles'> = {
    assistant: {
      placement: 'start',
      typing: { step: 2, interval: 100 },
      variant: 'outlined',
      avatar: { icon: <OpenAIFilled /> },
      messageRender: renderMarkdown,
      styles: {
        content: {
          borderRadius: 16,
        },
      },
    },
    user: {
      placement: 'end',
      variant: 'outlined',
      styles: {
        content: {
          borderRadius: 16,
        },
      },
    },
  };

const SmartChatReport = () => {
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState<IChatMessage[]>(initialMessages);
    const [loading, setLoading] = useState(false);
    const [renderKey, setRenderKey] = useState(0);
    const [lastResponseLength, setLastResponseLength] = useState(0);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [user, setUser] = useState({});
    const [teams, setTeams] = useState<IRPTTeam[]>([]);
    const [selectedTeam, setselectedTeam] = useState({});
    const [organization, setOrganization] = useState({});
    const [showPrompts, setShowPrompts] = useState(Boolean);
    const [currentDate, setCurrentDate] = useState('');
    const now_date = new Date().toDateString();
    const includeArchivedProjects = useAppSelector(state => state.reportingReducer.includeArchivedProjects);
    const ref = useChatScroll(chatMessages)

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        // onRequest(info.data.description as string);
        setMessageInput(info.data.description as string);
        handleSend(info.data.description as string);
        setShowPrompts(false);
    };

    const handleSend = async (messageInput:string) => {
        if (!messageInput.trim()) return;

        const userMessage: IChatMessage = {
            role: "user",
            content: messageInput
        };

        setChatMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setMessageInput('');
        try {

            const updatedChatMessages = [...chatMessages, userMessage];
            console.log("Updated Chat Messages:", updatedChatMessages.slice(-5));
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
            const response = await apiAiChatClient.post('/chat', requestBody);
            const responseText = `${response.data.response}`.trim();
            setIsTyping(true);
            const aiMessage: IChatMessage = {
                role: "assistant",
                content: responseText
            };
            setChatMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);

        } catch (error) {
            logger.error('handleSend', error);
            const errorMessage: IChatMessage = {
                role: "assistant",
                content: "Something went wrong. Please try again later."
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDataAndSetChat = async () => {
            setLoading(true);
            try {
                // Fetch teams, organization, and members data concurrently
                const [user, teamsResponse, infoResponse, membersResponse] = await Promise.all([
                    authApiService.verify(),
                    reportingApiService.getOverviewTeams(includeArchivedProjects),
                    reportingApiService.getInfo(),
                    reportingApiService.getMembers(includeArchivedProjects),
                ]);

                // Extract and set data if the API calls succeed
                if (teamsResponse.done) {
                    setTeams(teamsResponse.body);
                }
                if (infoResponse.done) {
                    setOrganization(infoResponse.body);
                }
                if (membersResponse.done) {
                    setselectedTeam(membersResponse.body);
                }
                setUser(user.user);
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
        <Flex vertical>
            <Flex gap="middle" ref={ref}
                style={{ height: '60vh', overflowY: 'auto', paddingRight: '2rem', paddingLeft: '2rem' }}
                vertical>
                <Bubble.List 
                    items={chatMessages.length > 0 ? chatMessages : [{ variant: 'borderless'}]}
                    roles={roles}
                />
            </Flex>
            <Flex justify='center' align='flex-end' style={{ paddingBottom: '1rem' }} vertical >
            {
                (chatMessages.length < 4) &&
                <Prompts
                    // style={{ alignItems: "center"}}
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
                        if (chatMessages.length > 100)
                            { 
                                alert("You have reached the maximum number of messages.");
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

