import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import FitnessGroupCard from './FitnessGroupCard';

const GroupCardDemo: React.FC = () => {
  // Sample group data
  const groups = [
    {
      id: 1,
      name: 'Cycling Adventures',
      description: 'Explore the city and beyond on two wheels. Road and mountain biking enthusiasts unite!',
      members: 94,
      category: 'Cycling',
      location: 'Various Routes',
      nextEvent: 'Sat 8:00 AM'
    },
    {
      id: 2,
      name: 'Morning Runners Club',
      description: 'Early birds who love to start their day with a refreshing run. All levels welcome!',
      members: 128,
      category: 'Running',
      location: 'City Park',
      nextEvent: 'Mon 6:00 AM'
    },
    {
      id: 3,
      name: 'Yoga & Mindfulness',
      description: 'Connect with fellow yogis, share practices, and grow your mindfulness journey together.',
      members: 76,
      category: 'Yoga',
      location: 'Online',
      nextEvent: 'Wed 7:30 PM'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Popular Fitness Groups
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Join a group that matches your interests and fitness goals
        </Typography>
        
        <Grid container spacing={4}>
          {groups.map(group => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <FitnessGroupCard {...group} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default GroupCardDemo;