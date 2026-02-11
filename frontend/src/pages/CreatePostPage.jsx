import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Paper } from '@mui/material'; 
import CreatePost from '../components/CreatePost'; 
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

const CreatePostPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const flash = useFlash();
  
  // Get pre-selected group ID if user clicked "Post" from inside a group
  const preSelectedGroupId = location.state?.groupId || '';

  // 1. Redirect if not logged in
  useEffect(() => {
    if (!user) {
      flash("Please sign in to write a post", "info");
      navigate('/signin'); 
    }
  }, [user, navigate, flash]);

  // 2. Fetch User's Groups
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const { data } = await axios.get('/api/groups');
        // Filter: Only groups where user is member OR creator
        const myGroups = data.filter(group => 
          group.members.includes(user._id) || group.creator === user._id
        );
        setGroups(myGroups);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };
    if (user) fetchUserGroups();
  }, [user]);

  // 3. Handle Post Submission
  const handleCreatePost = async (postData) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    if (postData.groupId) formData.append('groupId', postData.groupId);
    if (postData.image) formData.append('image', postData.image); 

    try {
      const token = localStorage.getItem('token');
      
      // Send ONE request. The backend middleware will:
      // 1. Upload image (Multer)
      // 2. Check AI Safety (aiMiddleware)
      // 3. Save to DB (postController)
      await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      flash('Post published successfully!', 'success'); 
      navigate('/');
      
    } catch (err) {
      console.error(err);
      // Catch 400 (AI Block) or 500 (Server Error)
      const errorMsg = err.response?.data?.message || 'Failed to create post';
      flash(errorMsg, 'error'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                Create New Post
            </Typography>
            
            <CreatePost 
              onSubmit={handleCreatePost} 
              loading={loading} 
              groups={groups} 
              initialGroupId={preSelectedGroupId} 
            />
        </Paper>
    </Container>
  );
};

export default CreatePostPage;