import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  LinearProgress,
  Avatar,
  AvatarGroup
} from '@mui/material';
import { 
  Groups as GroupsIcon,
  LocationOn as MapPin,
  CalendarMonth as Calendar,
  People as Users,
  Add as AddIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

interface GroupCardProps {
  id: number;
  name: string;
  description: string;
  membersCount: number;
  category: string;
  location: string;
  nextEvent: string | null;
  imageUrl?: string;
}

const GroupCard: React.FC<GroupCardProps> = ({
  id, 
  name, 
  description, 
  membersCount, 
  category, 
  location, 
  nextEvent,
  imageUrl
}) => {
  return (
    <Card
      className="group-card"
      sx={{
        overflow: 'hidden',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid #eee',
        boxShadow: 'none'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 200,
          background: getCardGradient(category),
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'black', opacity: 0.1 }} />
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <Chip 
            label={category}
            sx={{ 
              bgcolor: 'white',
              color: '#16a34a',
              fontWeight: 'medium',
              borderRadius: '16px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
            }} 
          />
        </Box>
      </Box>
      
      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1.5 }}>
          {name}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical' 
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Users fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {membersCount} members
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MapPin fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
          </Box>
          
          {nextEvent && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Calendar fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Next: {nextEvent}
              </Typography>
            </Box>
          )}
          
          <Button 
            component={Link}
            to={`/fitness-groups/${id}`}
            variant="contained" 
            fullWidth
            sx={{ 
              background: 'linear-gradient(90deg, #22c55e, #f59e0b)',
              textTransform: 'none',
              fontWeight: 'bold',
              color: 'white',
              borderRadius: '24px',
              py: 1.2,
              '&:hover': {
                background: 'linear-gradient(90deg, #16a34a, #d97706)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            Join Group
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Helper function to generate different gradients based on category
function getCardGradient(category: string): string {
  switch(category.toLowerCase()) {
    case 'running':
      return 'linear-gradient(135deg, #bae6fd, #e0f2fe)';
    case 'yoga':
      return 'linear-gradient(135deg, #bbf7d0, #dcfce7)';
    case 'strength training':
      return 'linear-gradient(135deg, #fed7aa, #ffedd5)';
    case 'hiit':
      return 'linear-gradient(135deg, #fecaca, #fee2e2)';
    case 'cycling':
      return 'linear-gradient(135deg, #bae6fd, #dbeafe)';
    case 'meditation':
      return 'linear-gradient(135deg, #ddd6fe, #ede9fe)';
    case 'dance':
      return 'linear-gradient(135deg, #fbcfe8, #fce7f3)';
    default:
      return 'linear-gradient(135deg, #d8b4fe, #ede9fe)';
  }
}

const FitnessGroupsHome: React.FC = () => {
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredGroup, setFeaturedGroup] = useState<GroupCardProps | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('fitness_groups')
        .select('*')
        .order('members_count', { ascending: false });
        
      if (error) {
        console.error('Error fetching groups:', error);
      } else if (data) {
        const formattedGroups = data.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          membersCount: group.members_count,
          category: group.category,
          location: group.location || 'Online',
          nextEvent: group.next_event_date ? new Date(group.next_event_date).toLocaleDateString() : null,
          imageUrl: group.image_url || null
        }));
        
        // Set the first group as featured and the rest for the grid
        if (formattedGroups.length > 0) {
          setFeaturedGroup(formattedGroups[0]);
          setGroups(formattedGroups.slice(1));
        } else {
          setGroups([]);
        }
      }
      
      setLoading(false);
    };
    
    fetchGroups();
  }, []);

  // Sample member avatars (would come from API in production)
  const sampleAvatars = [
    { initials: 'JD', color: '#818cf8' },
    { initials: 'KL', color: '#fb7185' },
    { initials: 'MN', color: '#34d399' }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        mt: 4, 
        p: 0, 
        borderRadius: 3, 
        bgcolor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        mb: 6,
        overflow: 'hidden'
      }}>
        <Grid container>
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              p: 4
            }}
          >
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Connect with fitness enthusiasts like you
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Create or join fitness groups, share your progress, participate in challenges, and achieve your fitness goals together.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/fitness-groups"
                sx={{ 
                  background: 'linear-gradient(45deg, #4f46e5 30%, #9333ea 90%)',
                  boxShadow: '0 3px 5px 2px rgba(79, 70, 229, .3)',
                  px: 4
                }}
              >
                Explore Groups
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/create-group"
                sx={{ px: 4 }}
              >
                Join Now
              </Button>
            </Stack>
          </Grid>
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              bgcolor: 'primary.light',
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 6
            }}
          >
            <svg className="h-64 w-64 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white', opacity: 0.6, height: '200px', width: '200px' }}>
              <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Grid>
        </Grid>
      </Box>
      
      {/* Featured Group - Large Card */}
      {featuredGroup && !loading && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Featured Group
            </Typography>
          </Box>
          
          <Card sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}>
            <Grid container>
              <Grid item xs={12} md={8}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Chip 
                      label="Featured Group" 
                      color="warning" 
                      size="small" 
                      sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#92400e' }}
                    />
                    <Chip 
                      label={`${featuredGroup.membersCount} members`} 
                      size="small"
                      sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }}
                    />
                  </Box>
                  
                  <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom>
                    {featuredGroup.name}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {featuredGroup.description}
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Recent Activity
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: '#818cf8', mr: 1.5, width: 36, height: 36 }}>LK</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Laura K. shared a new workout
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            2 hours ago
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: '#34d399', mr: 1.5, width: 36, height: 36 }}>MT</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Mike T. posted a comment
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Yesterday
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: '#a855f7', mr: 1.5, width: 36, height: 36 }}>AJ</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Alex J. posted a new challenge tip
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Yesterday
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                  
                  <Button 
                    component={Link}
                    to={`/fitness-groups/${featuredGroup.id}`}
                    variant="contained" 
                    size="large"
                    sx={{ 
                      background: 'linear-gradient(45deg, #4f46e5 30%, #9333ea 90%)',
                      boxShadow: '0 3px 5px 2px rgba(79, 70, 229, .3)',
                    }}
                  >
                    Join Challenge
                  </Button>
                </CardContent>
              </Grid>
              <Grid item xs={12} md={4} sx={{ 
                background: getCardGradient(featuredGroup.category),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                color: 'white'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  {featuredGroup.nextEvent ? (
                    <>
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>Day 16</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>of the challenge</Typography>
                      <Chip 
                        label="14 days remaining" 
                        icon={<Calendar fontSize="small" />}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', color: '#4f46e5' }}
                      />
                    </>
                  ) : (
                    <>
                      <GroupsIcon sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h6" fontWeight="medium">
                        Join {featuredGroup.membersCount} members
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                        Active fitness community
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}
      
      {/* Popular Groups Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Popular Fitness Groups
          </Typography>
          <Button 
            component={Link} 
            to="/fitness-groups" 
            sx={{ fontWeight: 'medium' }} 
            color="primary"
          >
            View All
          </Button>
        </Box>
        
        {loading ? (
          <LinearProgress sx={{ mb: 4 }} />
        ) : groups.length === 0 && !featuredGroup ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No groups found. Be the first to create one!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {/* Display groups */}
            {groups.slice(0, 6).map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                <GroupCard 
                  id={group.id}
                  name={group.name}
                  description={group.description}
                  membersCount={group.membersCount}
                  category={group.category}
                  location={group.location}
                  nextEvent={group.nextEvent}
                  imageUrl={group.imageUrl}
                />
              </Grid>
            ))}
            
            {/* If no real groups exist yet, show sample ones */}
            {groups.length === 0 && !featuredGroup && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <GroupCard
                    id={1}
                    name="Morning Runners Club"
                    description="Early birds who love to start their day with a refreshing run. All levels welcome!"
                    membersCount={1245}
                    category="Running"
                    location="Local Parks"
                    nextEvent="Jun 25, 2023"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <GroupCard
                    id={2}
                    name="Yoga & Mindfulness"
                    description="Connect with fellow yogis, share practices, and grow your mindfulness journey together."
                    membersCount={3450}
                    category="Yoga"
                    location="Online"
                    nextEvent="Jun 20, 2023"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <GroupCard
                    id={3}
                    name="Strength Training Pros"
                    description="For dedicated lifters looking to improve technique, share progress, and motivate each other."
                    membersCount={2815}
                    category="Strength Training"
                    location="City Gym"
                    nextEvent="Jun 22, 2023"
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Box>
      
      {/* Create Your Own Group CTA */}
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          borderRadius: 3, 
          bgcolor: 'primary.light',
          background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
          color: 'white',
          mb: 6
        }}
      >
        <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom>
          Ready to start your own fitness community?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
          Create your own group and connect with people who share your fitness interests and goals.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          component={Link}
          to="/create-group"
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)'
            },
            px: 4,
            py: 1
          }}
        >
          Create a Group
        </Button>
      </Box>
    </Container>
  );
};

export default FitnessGroupsHome;