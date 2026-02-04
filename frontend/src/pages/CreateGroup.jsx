import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CloudUpload } from '@mui/icons-material';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState(''); 
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) return '';
    const formData = new FormData();
    formData.append('image', image);
    const token = localStorage.getItem('token');
    

    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL || ''}/api/posts/upload`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      
      await axios.post('/api/groups', {
        name,
        description,
        theme: theme || 'General',
        imageUrl, // Saving the image URL
        creator: user._id,
        members: [user._id],
      });
      navigate('/groups');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e0e0e0' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Create New Group
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Start a community. Add a cover image to make it stand out.
        </Typography>

        {error && <Typography color="error" mb={2} fontWeight="bold">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          {/* Image Upload Area */}
          <Box 
            sx={{ 
              border: '2px dashed #ccc', 
              borderRadius: 2, 
              p: 3, 
              textAlign: 'center', 
              mb: 3,
              cursor: 'pointer',
              bgcolor: '#fafafa',
              '&:hover': { bgcolor: '#f0f0f0', borderColor: 'primary.main' }
            }}
            onClick={() => document.getElementById('group-image-input').click()}
          >
            {image ? (
              <Typography fontWeight="bold" color="primary">{image.name}</Typography>
            ) : (
              <>
                <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">Click to upload a cover image</Typography>
              </>
            )}
            <input 
              id="group-image-input" 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleImageChange} 
            />
          </Box>

          <TextField
            label="Group Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            label="Theme (e.g. Mystery, Sci-Fi)"
            fullWidth
            margin="normal"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            required
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Group'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateGroup;