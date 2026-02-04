import React from 'react';
import { Container, Typography, Button, Box, Paper, Avatar, Stack, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PostAdd, GroupAdd, Logout, Person } from '@mui/icons-material';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="error">
          Session Expired
        </Typography>
        <Button variant="contained" onClick={() => navigate('/signin')}>
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          borderRadius: 4, 
          border: '1px solid #e0e0e0',
          textAlign: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        {/* 1. User Identity Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2, 
              bgcolor: 'primary.main',
              fontSize: '3rem',
              fontWeight: 'bold',
              boxShadow: 3
            }}
          >
            {user.name?.charAt(0).toUpperCase() || <Person />}
          </Avatar>
          
          <Typography variant="h4" fontWeight="900" color="primary.main">
            {user.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="normal">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" align="left" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        
        <Stack spacing={2} sx={{ mb: 5 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<PostAdd />}
            fullWidth
            onClick={() => navigate('/create-post')}
            sx={{ py: 1.5, fontSize: '1.1rem', justifyContent: 'flex-start', pl: 4 }}
          >
            Write a New Post
          </Button>

          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            startIcon={<GroupAdd />}
            fullWidth
            onClick={() => navigate('/create-group')}
            sx={{ py: 1.5, fontSize: '1.1rem', justifyContent: 'flex-start', pl: 4, borderWidth: 2 }}
          >
            Start a New Group
          </Button>
        </Stack>

        <Button
          variant="text"
          color="error"
          size="large"
          startIcon={<Logout />}
          onClick={() => {
            logout();
            navigate('/');
          }}
          sx={{ fontWeight: 'bold' }}
        >
          Sign Out
        </Button>

      </Paper>
    </Container>
  );
};

export default Profile;