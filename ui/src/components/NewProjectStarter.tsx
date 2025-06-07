import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import blankCanvasImg from '../assets/figma_components/0:117.svg';
import templateImg from '../assets/figma_components/0:118.svg';
import project1Img from '../assets/figma_components/0:119.svg';
import project2Img from '../assets/figma_components/0:116.svg';
import { useNavigate } from 'react-router-dom';

const recentProjects = [
  {
    title: 'Project Alpha',
    lastEdited: '2 days ago',
    img: project1Img,
  },
  {
    title: 'Project Beta',
    lastEdited: '1 week ago',
    img: project2Img,
  },
];

const NewProjectStarter: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Start a new project</Typography>
      <Grid container spacing={4}>
        <Grid size={6}>
          <Card sx={{ p: 3, borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            <img src={blankCanvasImg} alt="Blank Canvas" style={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>Blank Canvas</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Start from scratch with a blank diagram.</Typography>
              <Button variant="contained" onClick={() => navigate('/blank-diagram')}>Start</Button>
            </Box>
          </Card>
          <Card sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            <img src={templateImg} alt="Template" style={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>Use a Template</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Choose from pre-made templates to get started quickly.</Typography>
              <Button variant="outlined">Browse Templates</Button>
            </Box>
          </Card>
        </Grid>
        <Grid size={6}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Projects</Typography>
          <Grid container spacing={2}>
            {recentProjects.map((proj) => (
              <Grid size={6} key={proj.title}>
                <Card sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img src={proj.img} alt={proj.title} style={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>{proj.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Last edited: {proj.lastEdited}</Typography>
                    <Button size="small" sx={{ mt: 1 }}>Continue</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewProjectStarter; 