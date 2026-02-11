import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Button, Box, Paper, Avatar, Stack, Divider, 
  Card, CardContent 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PostAdd, GroupAdd, Logout, Person, AutoAwesome } from '@mui/icons-material';
import { useFlash } from '../context/FlashContext';

const Profile = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  
  const flash = useFlash();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGetRecommendations = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const { data } = await axios.get('/api/ai/recommendations', {
        headers: { Authorization: `Bearer ${token}`}
      });
      
      setRecommendations(data);
      flash("AI Recommendations Ready!", "success");
    } catch (err) {
      console.error(err);
      flash("Failed to generate recommendations", "error");
    } finally {
      setAiLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="error">Session Expired</Typography>
        <Button variant="contained" onClick={() => navigate('/signin')}>Sign In</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      
      {/* SECTION 1: USER PROFILE */}
      <Paper 
        elevation={0} 
        sx={{ p: 5, borderRadius: 4, border: '1px solid #e0e0e0', textAlign: 'center', backgroundColor: '#ffffff', mb: 4 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main', fontSize: '3rem', fontWeight: 'bold', boxShadow: 3 }}>
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
          <Button variant="contained" size="large" startIcon={<PostAdd />} fullWidth onClick={() => navigate('/create-post')} sx={{ py: 1.5, justifyContent: 'flex-start', pl: 4 }}>
            Write a New Post
          </Button>

          <Button variant="outlined" size="large" startIcon={<GroupAdd />} fullWidth onClick={() => navigate('/create-group')} sx={{ py: 1.5, justifyContent: 'flex-start', pl: 4, borderWidth: 2 }}>
            Start a New Group
          </Button>
        </Stack>

        <Button variant="text" color="error" size="large" startIcon={<Logout />} onClick={() => { logout(); navigate('/'); }} sx={{ fontWeight: 'bold' }}>
          Sign Out
        </Button>
      </Paper>

      {/* SECTION 2: AI FEATURES */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#f0f7ff', borderRadius: 4, border: '1px solid #bbdefb' }}>
        <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           <AutoAwesome color="primary"/> AI Book Match
        </Typography>
        <Typography variant="body2" sx={{mb: 2, color: 'text.secondary'}}>
          Get personalized book suggestions based on your groups and posts.
        </Typography>

        {/* 4. CONDITIONAL RENDERING: UI Feedback */}
        <Button 
          variant="contained" 
          onClick={handleGetRecommendations} 
          disabled={aiLoading}
          fullWidth
        >
          {aiLoading ? "Asking Gemini AI..." : "Get Recommendations"}
        </Button>

        <Stack spacing={2} mt={3}>
          {/* 5. MAPPING: The Loop */}
          {recommendations.map((book, i) => ( 
            <Card key={i} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">{book.title}</Typography>
                <Typography variant="caption" color="text.secondary">by {book.author}</Typography>
                <Typography variant="body2" mt={1}>{book.reason}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

    </Container>
  );
};

export default Profile;