import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Chip, Button, Divider, Paper, Stack, CircularProgress
} from '@mui/material';
import { AccessTime, Person, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/posts/${postId}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
  if (!post) return <Typography align="center" mt={10}>Post not found</Typography>;

  return (
    <Container maxWidth="md">
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, bgcolor: 'white', borderRadius: 4 }}>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          {post.title}
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mb: 4, color: 'text.secondary' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Person fontSize="small" />
            <Typography variant="body2">{post.author?.name || 'Unknown Author'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime fontSize="small" />
            <Typography variant="body2">{new Date(post.createdAt).toLocaleDateString()}</Typography>
          </Box>
        </Stack>

        {post.imageUrl && (
          <Box 
            sx={{ 
              width: '100%', 
              maxHeight: '500px', 
              bgcolor: '#f0f0f0',
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
              display: 'flex',
              justifyContent: 'center' 
            }}
          >
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                maxHeight: '500px', 
                objectFit: 'contain' 
              }} 
            />
          </Box>
        )}

        <Divider sx={{ mb: 4 }} />

        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.8, 
            color: 'text.primary',
            whiteSpace: 'pre-wrap' 
          }}
        >
          {post.content}
        </Typography>

      </Paper>
    </Container>
  );
};

export default PostDetail;