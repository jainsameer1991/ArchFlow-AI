import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, TextField, Paper, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import aiBannerIcon from '../../assets/figma_components/0:119.svg';

const DUMMY_MESSAGES = [
  { from: 'ai', text: 'Hi! How can I help you with your architecture today?' },
  { from: 'user', text: 'Show me a sample microservices diagram.' },
  { from: 'ai', text: 'Here is a sample microservices diagram...' },
];

const AIAssistantPanel: React.FC = () => {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      setInput('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', bgcolor: '#fafbfc', minHeight: 0 }}>
      <Box sx={{ position: 'relative', p: 2, pb: 0 }}>
        <img src={aiBannerIcon} alt="AI Banner" style={{ position: 'absolute', top: 10, right: 10, width: 60, height: 60, opacity: 0.12, pointerEvents: 'none' }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>AI Assistant</Typography>
      </Box>
      <Paper elevation={0} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, bgcolor: 'transparent' }}>
        <Stack spacing={2}>
          {messages.map((msg, idx) => (
            <Box key={idx} sx={{ alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <Paper sx={{ p: 1.5, bgcolor: msg.from === 'user' ? '#1976d2' : '#fff', color: msg.from === 'user' ? '#fff' : 'inherit', borderRadius: 2, boxShadow: 1 }}>{msg.text}</Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>
      <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #eee', display: 'flex', gap: 1, alignItems: 'center', bgcolor: '#fafbfc', flexShrink: 0 }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type your message..."
          size="small"
          fullWidth
          sx={{ bgcolor: '#fff', borderRadius: 2 }}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!input.trim()} size="large">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AIAssistantPanel;
