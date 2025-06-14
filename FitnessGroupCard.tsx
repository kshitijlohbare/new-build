import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Users, MapPin, Calendar } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface FitnessGroupCardProps {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  location: string;
  nextEvent?: string;
}

const FitnessGroupCard: React.FC<FitnessGroupCardProps> = ({
  id,
  name,
  description,
  members,
  category,
  location,
  nextEvent
}) => {
  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        },
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.08)',
        height: '100%',
        background: 'white',
      }}
    >
      {/* Card Header/Image Area */}
      <Box
        sx={{
          height: 200,
          background: getCategoryGradient(category),
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <Chip 
            label={category}
            variant="filled"
            size="small"
            sx={{ 
              bgcolor: 'white', 
              color: '#16a34a',
              fontWeight: 500,
              fontSize: '0.75rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }} 
          />
        </Box>
      </Box>

      {/* Card Content */}
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {name}
        </Typography>
        
        <Typography 
          color="text.secondary" 
          variant="body2"
          sx={{ 
            mb: 3, 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Stats and info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Users sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                {members} members
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MapPin sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
          </Box>
          
          {/* Next event */}
          {nextEvent && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                Next: {nextEvent}
              </Typography>
            </Box>
          )}
          
          {/* Join button */}
          <Button
            component={Link}
            to={`/fitness-groups/${id}`}
            sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #22c55e, #f59e0b)',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '100px',
              py: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #16a34a, #d97706)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }
            }}
            fullWidth
          >
            Join Group
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Helper function to generate soft gradients based on category
const getCategoryGradient = (category: string): string => {
  const base = 'linear-gradient(to bottom right';
  
  switch (category.toLowerCase()) {
    case 'cycling':
      return `${base}, #E2F5F1, #BEE9DE)`; // Soft mint/teal gradient
    case 'running':
      return `${base}, #E0F2FE, #BAE6FD)`; // Soft blue gradient
    case 'yoga':
      return `${base}, #DCFCE7, #BBF7D0)`; // Soft green gradient
    case 'strength training':
      return `${base}, #FFEDD5, #FED7AA)`; // Soft orange gradient
    case 'hiit':
      return `${base}, #FEE2E2, #FECACA)`; // Soft red gradient
    case 'meditation': 
      return `${base}, #EDE9FE, #DDD6FE)`; // Soft purple gradient
    default:
      return `${base}, #E5E7EB, #D1D5DB)`; // Soft gray gradient
  }
};

export default FitnessGroupCard;