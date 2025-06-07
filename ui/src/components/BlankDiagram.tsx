import React from 'react';
import { Box, Typography, Tabs, Tab, InputBase, Paper, Grid, Card, Button, Divider, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ServerIcon from '../assets/figma_components/0:111.svg';
import DatabaseIcon from '../assets/figma_components/0:112.svg';
import CloudIcon from '../assets/figma_components/0:113.svg';
import UsersIcon from '../assets/figma_components/0:119.svg';
import SettingsIcon from '../assets/figma_components/0:115.svg';
import IntegrationIcon from '../assets/figma_components/0:116.svg';

const componentLibrary = [
  { icon: ServerIcon, label: 'Server', desc: 'Represents a physical or virtual server' },
  { icon: DatabaseIcon, label: 'Database', desc: 'A structured collection of data' },
  { icon: CloudIcon, label: 'Cloud', desc: 'A network of shared computing resources' },
  { icon: UsersIcon, label: 'Users', desc: 'Individuals interacting with the system' },
  { icon: SettingsIcon, label: 'Settings', desc: 'Configuration and customization options' },
  { icon: IntegrationIcon, label: 'Integration', desc: 'Connections between different systems' },
];

const BlankDiagram: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  return (
    <Box sx={{ p: 0, background: '#fafbfc', minHeight: '100vh' }}>
      <Box sx={{ px: 4, pt: 2, pb: 1 }}>
        <Typography variant="h5" fontWeight={700} color="#bdbdbd">Blank Diagram</Typography>
      </Box>
      <Paper elevation={0} sx={{ m: 2, p: 4, borderRadius: 3, minHeight: 600 }}>
        <Grid container spacing={4} columns={12}>
          <Grid size={8}>
            <Typography variant="h4" fontWeight={700} gutterBottom>Untitled Diagram</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Diagram" sx={{ fontWeight: 600 }} />
              <Tab label="Simulation" sx={{ fontWeight: 600 }} />
              <Tab label="Documentation" sx={{ fontWeight: 600 }} />
            </Tabs>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Component Library</Typography>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, width: 340 }}>
              <InputBase placeholder="Search components" sx={{ flex: 1, ml: 1 }} />
              <SearchIcon color="action" />
            </Paper>
            <Grid container spacing={2} columns={12}>
              {componentLibrary.map((comp, idx) => (
                <Grid size={4} key={comp.label}>
                  <Card variant="outlined" sx={{ borderRadius: 3, p: 2, minHeight: 110, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                    <img src={comp.icon} alt={comp.label} style={{ width: 32, height: 32, marginBottom: 8 }} />
                    <Typography variant="subtitle1" fontWeight={700}>{comp.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{comp.desc}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={4}>
            <Box sx={{ pl: { md: 4 }, pt: 2 }}>
              <Typography variant="h6" fontWeight={700}>AI Assistant</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>AI Chat History</Typography>
              <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, minHeight: 120, mb: 2, p: 1 }} />
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                <Paper elevation={0} sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 2, minHeight: 40, p: 1 }} />
                <Button variant="contained" sx={{ borderRadius: 3, background: '#f5f6fa', color: '#222', boxShadow: 'none', textTransform: 'none', fontWeight: 600, minWidth: 100 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 18, transform: 'rotate(-45deg)' }}>↑</span> Submit
                  </span>
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BlankDiagram; 