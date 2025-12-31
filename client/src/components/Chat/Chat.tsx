import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../App';
import { TMessages } from '../../services/server/types';
import Button from '../Button/Button';
import { useTypingState } from '../../hooks/useTypingState';
import './Chat.scss'

interface IChat {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const Chat: React.FC<IChat> = ({ isOpen, onToggle }) => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [messages, setMessages] = useState<TMessages>([]);
    const [_, setHash] = useState<string>('');
    const messageRef = useRef<HTMLInputElement>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const user = store.getUser();

    useEffect(() => {
        const handleInputKeyDown = (e: Event) => {
            if (!('key' in e)) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                if (isOpen && document.activeElement === messageRef.current) {
                    sendClickHandler();
                } else if (!isOpen) {
                    onToggle(true);
                    setTimeout(() => {
                        messageRef.current.focus();
                    }, 0);
                }
            }

            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                e.stopPropagation();
                onToggle(false);
                useTypingState.set(false);
                cancelAutoClose();
            }
        }

        document.addEventListener('keydown', handleInputKeyDown);

        return () => {
            document.removeEventListener('keydown', handleInputKeyDown);
        };

    }, [isOpen, onToggle]);

    const cancelAutoClose = () => {
        if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = null;
        }
    };

    const startAutoClose = () => {
        cancelAutoClose();
        autoCloseTimerRef.current = setTimeout(() => {
            if (isOpen && !useTypingState.isTyping) {
                onToggle(false);
            }
        }, 3000);
    };

    const handleInputChange = () => {
        useTypingState.set(true);

        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        typingTimerRef.current = setTimeout(() => {
            useTypingState.set(false);
        }, 2000);
    };

    useEffect(() => {
        if (isOpen && !isHovered && !useTypingState.isTyping) {
            startAutoClose();
        } else {
            cancelAutoClose();
        }

        return () => {
            cancelAutoClose();
            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current);
            }
        };
    }, [isOpen, isHovered, useTypingState.isTyping]);

    useEffect(() => {
        if (!user) return;

        server.startChatMessages((hash: string) => {
            const currentMessages = store.getMessages();

            setMessages(prev => {
                const newMessages = currentMessages.filter(
                    m => !prev.some(p => p.author === m.author && p.created === m.created)
                );

                if (newMessages.length > 0) {
                    setTimeout(() => onToggle(true), 0);
                    return [...prev, ...newMessages].sort(
                        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
                    );
                }

                return prev;
            });
            setHash(hash);
        });

        return () => {
            server.stopChatMessages();
        };
    }, [user]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const input = useMemo(() =>
        <input
            ref={messageRef}
            placeholder='сообщение'
            onChange={handleInputChange}
            maxLength={96}
        />, []);

    const sendClickHandler = () => {
        if (messageRef.current) {
            const message = messageRef.current.value;
            if (message) {
                server.sendMessage(message);
                messageRef.current.value = '';
                useTypingState.set(false);
            }
            messageRef.current.focus();
        }
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const toggleChat = () => onToggle(!isOpen);

    return (<div
        className={cn('chat', { 'chat-open': isOpen })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <div className="chat-toggle" onClick={toggleChat}>
            {isOpen ? 'Закрыть чат' : 'Открыть чат'}
        </div>

        {isOpen && (
            <div className="chat-window">
                <div className="chat-header">
                    <span>Чат</span>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty">
                            Нет сообщений
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) =>
                                <div key={index}>
                                    {`${message.author} (${message.created}): ${message.message}`}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                <div className="chat-input">
                    {input}
                    <Button
                        className="chat-send-button"
                        text="➤"
                        onClick={sendClickHandler}
                    />
                </div>
            </div>
        )}

    </div>)
}

export default Chat;