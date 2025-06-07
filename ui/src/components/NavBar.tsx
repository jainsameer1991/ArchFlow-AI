import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, InputBase, Avatar, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/figma_components/0:110.svg';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', background: '#fff' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 4 }}>
        {/* Left: Logo and Brand */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton edge="start" color="inherit" aria-label="logo" sx={{ p: 0 }}>
            {/* Figma logo icon */}
            <img src={logo} alt="Logo" width={24} height={24} />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="#0D1420">
            ArchFlow AI
          </Typography>
        </Stack>
        {/* Center: Navigation Links */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Button color="inherit" sx={{ fontWeight: 500, textTransform: 'none' }} onClick={() => navigate('/')}>Dashboard</Button>
          <Button color="inherit" sx={{ fontWeight: 500, textTransform: 'none' }}>Templates</Button>
          <Button color="inherit" sx={{ fontWeight: 500, textTransform: 'none' }}>Documentation</Button>
          <Button color="inherit" sx={{ fontWeight: 500, textTransform: 'none' }}>Help</Button>
        </Stack>
        {/* Right: Search, New Project, Avatar */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F3F6FA', borderRadius: 2, px: 2, py: 0.5 }}>
            <SearchIcon sx={{ color: '#466FA6', mr: 1 }} />
            <InputBase placeholder="Search" sx={{ fontSize: 16, color: '#0D1420', width: 120 }} />
          </Box>
          <Button variant="contained" sx={{ bgcolor: '#1976D2', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#1565c0' } }} onClick={() => navigate('/new-project')}>
            New Project
          </Button>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#222' }}>A</Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 