import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../lib/state-management';
import {
  Container,
  Card,
  Input,
  Button,
  Text,
  Flex,
  Badge
} from '../ui';

const Chat: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearHistory } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Card style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Flex justify="between" align="center" style={{ marginBottom: '1rem' }}>
          <Text variant="h2">Chat</Text>
          <Button variant="outline" onClick={clearHistory}>
            Clear History
          </Button>
        </Flex>

        {/* Messages */}
        <Flex
          direction="column"
          gap="md"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          {messages.map(message => (
            <Flex
              key={message.id}
              justify={message.type === 'user' ? 'end' : 'start'}
            >
              <Card
                style={{
                  maxWidth: '70%',
                  backgroundColor:
                    message.type === 'user'
                      ? 'var(--color-primary)'
                      : 'var(--color-surface)',
                  color: message.type === 'user' ? 'white' : 'var(--color-text)'
                }}
              >
                <Flex direction="column" gap="xs">
                  <Text>{message.content}</Text>
                  <Text
                    variant="caption"
                    style={{
                      color: message.type === 'user' ? 'white' : 'var(--color-text-secondary)',
                      opacity: 0.7
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </Flex>
              </Card>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Flex>

        {/* Error Message */}
        {error && (
          <Badge variant="danger" style={{ marginBottom: '1rem' }}>
            {error}
          </Badge>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <Flex gap="md">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Flex>
        </form>
      </Card>
    </Container>
  );
};

export default Chat; 