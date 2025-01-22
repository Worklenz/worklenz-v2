import React, { useEffect, useState } from 'react';
import { FireOutlined, OpenAIFilled, ReadOutlined } from '@ant-design/icons';
import { Card, ConfigProvider, Flex, GetProp, PaginationProps, Space, Spin, theme, Typography } from 'antd';
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
import { se } from 'date-fns/locale';
import { current } from '@reduxjs/toolkit';

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
    const [currentDate, setCurrentDate] = useState(new Date());
    const now_date = new Date();
    const includeArchivedProjects = useAppSelector(state => state.reportingReducer.includeArchivedProjects);
    const ref = useChatScroll(chatMessages)
    React.useEffect(() => {
        if (lastResponseLength > 0) {
            const id = setTimeout(
                () => {
                    setRenderKey((prev) => prev + 1);
                },
                lastResponseLength * 100 + 2000,
            );

            return () => {
                clearTimeout(id);
            };
        }
    }, [lastResponseLength]);

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        // onRequest(info.data.description as string);
        setMessageInput(info.data.description as string);
        handleSend();
        setShowPrompts(false);
    };

    const handleSend = async () => {
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
            console.log(requestBody)
            const response = await apiAiChatClient.post('/chat', requestBody);
            const responseText = `${response.data.response}`.trim();
            setLastResponseLength(responseText.length);
            setTypingText(responseText);
            setIsTyping(true);

            const typingDelay = Math.min(responseText.length * 100 + 2000, 10000);

            setTimeout(() => {
                const aiMessage: IChatMessage = {
                    role: "assistant",
                    content: responseText
                };
                setChatMessages(prev => [...prev, aiMessage]);
                setIsTyping(false);
            }, typingDelay);

        } catch (error) {
            logger.error('handleSend', error);
            const errorMessage: IChatMessage = {
                role: "assistant",
                content: "Sorry, there was an error processing your request."
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
                console.log("Current Date:", now_date.toDateString());
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
                {chatMessages.filter((message) => message.role !== "system").map((message, index) => (
                    <Bubble
                        shape="round"
                        variant='outlined'
                        key={`${message.role}-${index}-${renderKey}`}
                        placement={message.role === "user" ? "end" : "start"}
                        content={message.content}
                        messageRender={renderMarkdown}
                        {...(message.role === "assistant" && {
                            avatar: { icon: <OpenAIFilled /> }
                            , variant: "borderless"
                        })}
                    />
                ))}
                {isTyping && (
                    <Bubble
                        typing={true}
                        variant="borderless"
                        placement="start"
                        content={typingText}
                        messageRender={renderMarkdown}
                        avatar={{ icon: <OpenAIFilled /> }}
                    />
                )}

            </Flex>
            
            {
                (chatMessages.length < 3) &&
                <Prompts
                    style={{ alignSelf: "flex-end"}}
                    items={senderPromptsItems} onItemClick={onPromptsItemClick} />
            }
            <Flex justify='center' align='flex-end' style={{ paddingTop: '1rem' }} vertical >
                <Sender
                    loading={loading}
                    placeholder='Type your message here...'
                    value={messageInput}
                    onChange={setMessageInput}
                    onSubmit={() => {
                        handleSend();
                        setShowPrompts(true);
                    }}
                />
            </Flex>
        </Flex>
    );
};

export default SmartChatReport;

