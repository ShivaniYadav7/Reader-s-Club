import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, Button, Skeleton, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { People, GroupWork, GroupAdd } from '@mui/icons-material'; // Import GroupAdd icon

const AllGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/groups')
      .then(res => setGroups(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      <Box sx={{ mb: 5, textAlign: 'center', pt: 4 }}>
        <Typography variant="h3" fontWeight="900" color="primary" gutterBottom>
          Find Your Community
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover groups discussing your favorite topics.
        </Typography>

        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          startIcon={<GroupAdd />}
          onClick={() => navigate('/create-group')}
          sx={{ borderRadius: 50, px: 4, fontWeight: 'bold' }}
        >
          Start New Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
           [...Array(4)].map((_, i) => (
             <Grid item xs={12} sm={6} md={3} key={i}>
               <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
             </Grid>
           ))
        ) : (
          groups.map((group) => (
            <Grid item key={group._id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '1px solid transparent',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 4, bgcolor: 'white' }
                }}
                onClick={() => navigate(`/groups/${group._id}`)}
              >
                <Box sx={{ height: 120, bgcolor: 'grey.300', position: 'relative' }}>
                  {group.imageUrl ? (
                    <CardMedia
                      component="img"
                      height="100%"
                      image={group.imageUrl}
                      alt={group.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%', 
                        background: 'linear-gradient(135deg, #3d405b 0%, #81b29a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <GroupWork sx={{ color: 'white', fontSize: 50, opacity: 0.5 }} />
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 2, textAlign: 'center', mt: -4, flexGrow: 1 }}>
                  <Avatar sx={{ 
                    width: 56, height: 56, mx: 'auto', 
                    bgcolor: 'white', color: 'primary.main',
                    border: '4px solid white', 
                    fontWeight: 'bold', fontSize: '1.5rem',
                    boxShadow: 1
                  }}>
                    {group.name.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, lineHeight: 1.2 }}>
                    {group.name}
                  </Typography>
                  
                  <Box display="flex" justifyContent="center" alignItems="center" color="text.secondary" mt={1} mb={2}>
                    <People fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    fontSize: '0.9rem'
                  }}>
                    {group.description}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button fullWidth variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                    View Group
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default AllGroups;