import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import dashboardHeaderIcon from '../../assets/figma_components/0:116.svg';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4, width: '100%' }}>
      {/* Heading */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <img src={dashboardHeaderIcon} alt="Dashboard Icon" width={40} height={40} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
      </Stack>
      {/* Welcome message */}
      <Typography variant="subtitle1" color="primary" gutterBottom>
        Welcome back, Alex! Here's an overview of your recent activity and projects.
      </Typography>

      {/* Recent Projects */}
      <Box mt={5}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Recent Projects
        </Typography>
        <Grid container columns={12} spacing={3}>
          {[1, 2, 3].map((project) => (
            <Grid size={{ xs: 12, md: 4 }} key={project}>
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Project Title {project}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last modified: July 15, 2024
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box mt={7}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 4 }}>
            Create New Project
          </Button>
          <Button variant="outlined" color="primary" sx={{ borderRadius: 2, px: 4 }}>
            Explore Templates
          </Button>
        </Stack>
      </Box>

      {/* Activity Feed */}
      <Box mt={7}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Activity Feed
        </Typography>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="body1">
                Project 'Web Application Architecture' updated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                July 15, 2024
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="body1">
                New user 'Sarah' joined the team
              </Typography>
              <Typography variant="body2" color="text.secondary">
                July 12, 2024
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default Dashboard;
