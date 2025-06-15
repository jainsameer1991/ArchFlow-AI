import React from 'react';
import { Box, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import MemoryIcon from '@mui/icons-material/Memory';
import ApiIcon from '@mui/icons-material/Api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const COMPONENTS = [
  { type: 'Kafka', label: 'Kafka', icon: <CloudQueueIcon /> },
  { type: 'Flink', label: 'Flink', icon: <MemoryIcon /> },
  { type: 'Spark', label: 'Spark', icon: <MemoryIcon /> },
  { type: 'Redis', label: 'Redis', icon: <StorageIcon /> },
  { type: 'PostgreSQL', label: 'PostgreSQL', icon: <StorageIcon /> },
  { type: 'MySQL', label: 'MySQL', icon: <StorageIcon /> },
  { type: 'MongoDB', label: 'MongoDB', icon: <StorageIcon /> },
  { type: 'S3', label: 'S3', icon: <CloudQueueIcon /> },
  { type: 'REST API', label: 'REST API', icon: <ApiIcon /> },
  { type: 'Client', label: 'Client', icon: <AccountCircleIcon /> },
];

function PaletteItem({ component }: { component: { type: string; label: string; icon: React.ReactNode } }) {
  // Drag logic can be added here if needed for integration
  return (
    <Box sx={{ opacity: 1, p: 1, m: 1, border: '1px solid #ccc', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'grab', background: '#fff' }}>
      {component.icon}
      <span>{component.label}</span>
    </Box>
  );
}

const ComponentPalette: React.FC = () => {
  return (
    <Box sx={{ width: 180, background: '#f7f7f7', p: 1, height: '100vh', overflowY: 'auto', borderRight: '1px solid #eee', boxSizing: 'border-box', flexShrink: 0 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Palette</Typography>
      {COMPONENTS.map((c) => <PaletteItem key={c.type} component={c} />)}
    </Box>
  );
};

export default ComponentPalette; 