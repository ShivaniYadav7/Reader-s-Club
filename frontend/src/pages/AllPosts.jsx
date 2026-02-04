import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PostAdd } from '@mui/icons-material'; // Import Icon

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/posts').then(res => setPosts(res.data));
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      {/* Updated Header Section */}
      <Box sx={{ mb: 5, textAlign: 'center', pt: 4 }}>
        <Typography variant="h3" fontWeight="900" color="primary" gutterBottom>
          Explore Posts
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Read what the community is writing about.
        </Typography>
        
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          startIcon={<PostAdd />}
          onClick={() => navigate('/create-post')}
          sx={{ borderRadius: 50, px: 4 }}
        >
          Write a Post
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 },
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              {post.imageUrl ? (
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt={post.title}
                  sx={{ height: 200, objectFit: 'cover', objectPosition: 'top center' }}
                />
              ) : (
                <Box sx={{ height: 200, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  No Image
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="secondary" fontWeight="bold" display="block" gutterBottom>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.length > 80 ? post.content.substring(0, 80) + '...' : post.content}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" color="primary" fontWeight="bold">Read Full Post</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllPosts;