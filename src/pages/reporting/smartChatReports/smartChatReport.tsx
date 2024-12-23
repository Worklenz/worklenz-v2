import React, { useState } from 'react';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { Bubble, BubbleProps, Sender } from '@ant-design/x';
import Markdownit from 'markdown-it';

const md = Markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps['messageRender'] = (content) => (
    <Typography>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
  );

const fooAvatar: React.CSSProperties = {
    color: '#f56a00',
    backgroundColor: '#fde3cf',
};

const barAvatar: React.CSSProperties = {
    color: '#fff',
    backgroundColor: '#87d068',
};

const messages = [
    {
        "role": "system", 
        "content": "How can I help you today?"
    },
];



const SmartChatReport = () => {
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState(messages);
    const [loading, setLoading] = useState(false);
    const [renderKey, setRenderKey] = useState(0);
    const [lastResponseLength, setLastResponseLength] = useState(0);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

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

        // Add user message
        const userMessage = {
            role: "user",
            content: messageInput
        };

        setChatMessages([...chatMessages, userMessage]);
        setLoading(true);
        setMessageInput('');

        try {
            const config = {
                method: 'post',
                url: 'http://127.0.0.1:8000/chat',
                headers: { 
                    'Content-Type': 'application/json'
                },
                data: {
                    input_text: messageInput
                }
            };

            // Send request to the backend
            const response = await axios.request(config);
            const responseText = `${response.data.response}`.trim();
            setLastResponseLength(responseText.length);
            setTypingText(responseText);
            setIsTyping(true);
            
            // Don't immediately add the AI message - wait for typing animation
            setTimeout(() => {
                const aiMessage = {
                    role: "assistant",
                    content: responseText
                };
                setChatMessages(prevMessages => [...prevMessages, aiMessage]);
                setIsTyping(false);
            }, responseText.length * 100 + 2000);

        } catch (error) {
            console.error("Error communicating with backend:", error);
            const errorMessage = {
                role: "assistant",
                content: "Sorry, there was an error processing your request."
            };
            setChatMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex vertical>
            {/* Chat messages container */}
            <Flex gap="middle" style={{height: '70vh', overflowY: 'auto'}} vertical>
                {chatMessages.map((message, index) => (
                    <Bubble 
                        key={`${index}-${renderKey}`}
                        placement={message.role === "user" ? "end" : "start"}
                        content={message.content}
                        messageRender={renderMarkdown}
                        avatar={{ icon: <UserOutlined />, style: message.role === "user" ? fooAvatar : barAvatar }}
                    />
                ))}
                {isTyping && (
                    <Bubble 
                        typing
                        placement="start"
                        content={typingText}
                        messageRender={renderMarkdown}
                        avatar={{ icon: <UserOutlined />, style: barAvatar }}
                    />
                )}
                {loading && <Bubble style={{padding: '0.5rem'}} placement="start" loading={loading} />}
            </Flex>

            {/* Sender at bottom */}
            <Flex justify='center' align='flex-end' style={{paddingTop: '1rem'}}>
                <Sender
                    placeholder='Type your message here...'
                    value={messageInput}
                    onChange={setMessageInput}
                    onSubmit={handleSend}
                />
            </Flex>
        </Flex>
    );
};

export default SmartChatReport;
