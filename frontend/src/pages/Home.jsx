import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack, 
  Skeleton,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  MenuBook, 
  ArrowForward, 
  ImageNotSupported,
  People 
} from '@mui/icons-material';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, groupsRes] = await Promise.all([
          axios.get('/api/posts'),
          axios.get('/api/groups')
        ]);
        setPosts(postsRes.data);
        setGroups(groupsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.style.display = 'none'; 
    e.target.nextSibling.style.display = 'flex'; 
  };

  const renderSkeletons = () => (
    [...Array(4)].map((_, i) => (
      <Grid item xs={12} sm={6} md={3} key={i}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="40%" />
      </Grid>
    ))
  );

  return (
    <Box sx={{ pb: 8 }}>
      {/* 1. HERO SECTION */}
      <Box sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={1.5}>
              COMMUNITY
            </Typography>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
              Share your love <br /> for reading.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '480px', lineHeight: 1.6 }}>
              Join a community of book lovers. Discuss your favorite plots, join reading groups, and write reviews.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<MenuBook />}
                onClick={() => navigate('/posts')}
                sx={{ px: 4 }}
              >
                Start Reading
              </Button>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
             <Box 
              component="img"
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Library"
              sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}
             />
          </Grid>
        </Grid>
      </Box>

      {/* 2. TRENDING POSTS */}
      <Box sx={{ mb: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">Trending Posts</Typography>
          <Button endIcon={<ArrowForward />} onClick={() => navigate('/posts')}>View All</Button>
        </Stack>

        <Grid container spacing={3}>
          {loading ? renderSkeletons() : posts.slice(0, 4).map((post) => (
            <Grid item key={post._id} xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  transition: '0.2s',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4, borderColor: 'transparent' }
                }}
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <Box sx={{ position: 'relative', height: 180, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                  {post.imageUrl ? (
                    <>
                      <CardMedia 
                        component="img" 
                        image={post.imageUrl} 
                        alt={post.title}
                        onError={handleImageError}
                        sx={{ 
                          height: '100%', 
                          width: '100%',
                          objectFit: 'cover', 
                          objectPosition: 'top center' 
                        }} 
                      />
                      <Box sx={{ display: 'none', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                        <ImageNotSupported />
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.light' }}>
                      <MenuBook sx={{ fontSize: 40, opacity: 0.5 }} />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="secondary" fontWeight="bold">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, lineHeight: 1.3 }}>
                     {post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 3. GROUPS SECTION */}
      <Box sx={{ bgcolor: '#f8f9fa', p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">Join a Group</Typography>
            <Typography variant="body2" color="text.secondary">Find people with similar interests</Typography>
          </Box>
          <Button endIcon={<ArrowForward />} onClick={() => navigate('/groups')}>Explore</Button>
        </Stack>

        <Grid container spacing={3}>
          {loading ? renderSkeletons() : groups.slice(0, 4).map((group) => (
            <Grid item key={group._id} xs={12} sm={6} md={3}>
               <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden', 
                  '&:hover': { bgcolor: 'white', boxShadow: 4 }
                }}
                onClick={() => navigate(`/groups/${group._id}`)}
              >
                <Box sx={{ height: 120, bgcolor: 'grey.300' }}>
                   {group.imageUrl ? (
                      <CardMedia 
                        component="img" 
                        image={group.imageUrl} 
                        sx={{ height: '100%', objectFit: 'cover' }} 
                      />
                   ) : (
                      <Box sx={{ height: '100%', background: 'linear-gradient(to right, #3d405b, #81b29a)' }} />
                   )}
                </Box>

                <Box sx={{ p: 2, textAlign: 'center', mt: -4 }}>
                   <Avatar sx={{ 
                      width: 50, height: 50, mx: 'auto', 
                      bgcolor: 'white', color: 'primary.main',
                      border: '3px solid white', 
                      fontWeight: 'bold' 
                    }}>
                      {group.name.charAt(0).toUpperCase()}
                   </Avatar>
                   
                   <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, lineHeight: 1.2 }}>
                     {group.name}
                   </Typography>

                   <Box display="flex" justifyContent="center" alignItems="center" color="text.secondary" mt={1}>
                     <People fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                     
                     <Typography variant="caption" fontWeight="bold">
                       {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
                     </Typography>
                     {/* ------------------------ */}
                     
                   </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;