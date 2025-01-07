import React, { useEffect, useState } from 'react';
import { fooAvatar, barAvatar } from './smart-chat-report-styles';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Space, Spin, Typography } from 'antd';
import { Bubble, BubbleProps, Sender } from '@ant-design/x';
import Markdownit from 'markdown-it';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { reportingApiService } from '@/api/reporting/reporting.api.service';
import logger from '@/utils/errorLogger';
import { IRPTTeam } from '@/types/reporting/reporting.types';
import { Prompts } from '@ant-design/x';



interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const initialMessages: ChatMessage[] = [
    {
        role: "assistant",
        content: "How can I help you today?"
    },
];

const SmartChatReport = () => {
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
    const [loading, setLoading] = useState(false);
    const [renderKey, setRenderKey] = useState(0);
    const [lastResponseLength, setLastResponseLength] = useState(0);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [teams, setTeams] = useState<IRPTTeam[]>([]);
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

        const userMessage: ChatMessage = {
            role: "user",
            content: messageInput
        };
        const systemMessage: ChatMessage = {
            role: "system",
            content: `You are a helpful assistant in worklenz. You can ask me anything about your projects, team members, or time reports. use markdown to format your text.
            team in orgamization: ${JSON.stringify(teams)}`
        };

        setChatMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setMessageInput('');
        try {

            const updatedChatMessages = [systemMessage, ...chatMessages, userMessage];
            const requestBody = {
                input_text: updatedChatMessages
            };
            console.log('requestBody', requestBody);
            const config = {
                method: 'post',
                url: 'http://127.0.0.1:8000/chat',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 600000,
                data: {
                    input_text: JSON.stringify(requestBody)
                }
            };

            const response = await axios.request(config);
            const responseText = `${response.data.response}`.trim();
            setLastResponseLength(responseText.length);
            setTypingText(responseText);
            setIsTyping(true);

            const typingDelay = Math.min(responseText.length * 100 + 2000, 10000);

            setTimeout(() => {
                const aiMessage: ChatMessage = {
                    role: "assistant",
                    content: responseText
                };
                setChatMessages(prev => [...prev, aiMessage]);
                setIsTyping(false);
            }, typingDelay);

        } catch (error) {
            logger.error('handleSend', error);
            const errorMessage: ChatMessage = {
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
            <Flex gap="middle" style={{ height: '50vh', overflowY: 'auto' }} vertical>
                {chatMessages.filter((message) => message.role !== "system").map((message, index) => (
                    <Bubble
                        key={`${message.role}-${index}-${renderKey}`}
                        placement={message.role === "user" ? "end" : "start"}
                        content={message.content}
                        messageRender={memoizedRenderMarkdown}
                        avatar={{ icon: <UserOutlined />, style: message.role === "user" ? fooAvatar : barAvatar }}
                    />
                ))}
                {isTyping && (
                    <Bubble
                        typing
                        placement="start"
                        content={typingText}
                        messageRender={memoizedRenderMarkdown}
                        avatar={{ icon: <UserOutlined />, style: barAvatar }}
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