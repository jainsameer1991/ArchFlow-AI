import * as React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import dashboardIcon from '../assets/figma_components/0:111.svg';
import canvasIcon from '../assets/figma_components/0:112.svg';
import aiIcon from '../assets/figma_components/0:113.svg';
import simulationIcon from '../assets/figma_components/0:119.svg';
import docIcon from '../assets/figma_components/0:115.svg';

const navItems = [
  { text: 'Dashboard', icon: <img src={dashboardIcon} alt="Dashboard" width={24} height={24} />, path: '/' },
  { text: 'Canvas', icon: <img src={canvasIcon} alt="Canvas" width={24} height={24} />, path: '/canvas' },
  { text: 'AI Assistant', icon: <img src={aiIcon} alt="AI Assistant" width={24} height={24} />, path: '/ai-assistant' },
  { text: 'Simulation', icon: <img src={simulationIcon} alt="Simulation" width={24} height={24} />, path: '/simulation' },
  { text: 'Documentation', icon: <img src={docIcon} alt="Documentation" width={24} height={24} />, path: '/documentation' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {navItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem
              sx={location.pathname === item.path ? { bgcolor: 'action.selected' } : {}}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
