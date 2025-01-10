import React, { useEffect, useState } from 'react';
import { fooAvatar, barAvatar } from './smart-chat-report-styles';
import axios from 'axios';
import { OpenAIFilled  } from '@ant-design/icons';
import { Flex, Space, Spin, Typography } from 'antd';
import { Bubble, BubbleProps, Sender } from '@ant-design/x';
import Markdownit from 'markdown-it';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { reportingApiService } from '@/api/reporting/reporting.api.service';
import logger from '@/utils/errorLogger';
import { IRPTTeam } from '@/types/reporting/reporting.types';
import { IChatMessage } from '@/types/aiChat/ai-chat.types';
import { Prompts } from '@ant-design/x';
import apiAiChatClient from '@/api/api-aichat-client';

const initialMessages: IChatMessage[] = [
    {
        role: "assistant",
        content: "How can I help you today?"
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
    const [teams, setTeams] = useState<IRPTTeam[]>([]);
    const [members, setMembers] = useState({});
    const [organization, setOrganization] = useState({});
    const [showPrompts, setShowPrompts] = useState(true);

    const md = Markdownit({ html: true, breaks: true });
    const includeArchivedProjects = useAppSelector(state => state.reportingReducer.includeArchivedProjects);

    const getTeams = async () => {
        setLoading(true);
        try {
            const { done, body } = await reportingApiService.getOverviewTeams(includeArchivedProjects);
            if (done) {
                setTeams(body);
            }
        } catch (error) {
            logger.error('getTeams', error);
        } finally {
            setLoading(false);
        }
    };

    const getInfo = async () => {
        setLoading(true);
        try {
            const { done, body } = await reportingApiService.getInfo();
            if (done) {
                setOrganization(body);
            }
        } catch (error) {
            logger.error('getInfo', error);
        } finally {
            setLoading(false);
    }};

    const getMembers = async () => {
        setLoading(true);
        try {
            const { done, body } = await reportingApiService.getMembers(includeArchivedProjects);
            if (done) {
                setMembers(body);
            }
        } catch (error) {
            logger.error('getMembers', error);
        } finally {
            setLoading(false);
    }};

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
                    org: JSON.stringify(organization),
                    teams: JSON.stringify(teams),
                    selectedTeamMembers: JSON.stringify(members),
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
        getTeams();
        getInfo();
        getMembers();
    }, [includeArchivedProjects]);

    const memoizedRenderMarkdown = React.useMemo(() => {
        return (content: string) => (
            <Typography>
                <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
            </Typography>
        );
    }, [md]);

    return (
        <Flex vertical>
            <Flex gap="middle" 
            style={{ height: '70vh', overflowY: 'auto', paddingRight: '2rem', paddingLeft: '2rem' }}
            vertical>
                {chatMessages.filter((message) => message.role !== "system").map((message, index) => (
                    <Bubble
                        key={`${message.role}-${index}-${renderKey}`}
                        placement={message.role === "user" ? "end" : "start"}
                        content={message.content}
                        messageRender={memoizedRenderMarkdown}
                        {...(message.role === "assistant" && { avatar: { icon: <OpenAIFilled /> } })}

                    />
                ))}
                {isTyping && (
                    <Bubble
                        typing
                        placement="start"
                        content={typingText}
                        messageRender={memoizedRenderMarkdown}
                        avatar={ {icon: <OpenAIFilled />} }
                    />
                )}
                {loading && <Space>
                    <Spin size="small" />
                </Space>}
            </Flex>


            <Flex justify='center' align='flex-end' style={{ paddingTop: '1rem' }} vertical >
                <Sender
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