import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';

const CreatePostPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const preSelectedGroupId = location.state?.groupId || '';

  useEffect(() => {
    if (!user) {
      navigate('/signin'); 
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('/api/groups');
        setGroups(response.data);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };
    if (user) fetchUserGroups();
  }, [user]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    
    const response = await axios.post('/api/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.imageUrl;
  };

  const handleCreatePost = async (postData) => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (postData.image) {
        imageUrl = await uploadImageToCloudinary(postData.image);
      }

      const payload = {
        title: postData.title,
        content: postData.content,
        imageUrl,
        groupId: postData.groupId || undefined,
      };

      const token = localStorage.getItem('token');
      await axios.post('/api/posts', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (postData.groupId) {
        navigate(`/groups/${postData.groupId}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatePost 
      onSubmit={handleCreatePost} 
      loading={loading} 
      groups={groups} 
      initialGroupId={preSelectedGroupId} 
    />
  );
};

export default CreatePostPage;