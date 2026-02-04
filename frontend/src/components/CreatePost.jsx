import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  MenuItem, 
  CircularProgress 
} from '@mui/material';
import { CloudUpload, Image as ImageIcon, PostAdd } from '@mui/icons-material';

const CreatePost = ({ onSubmit, loading, groups = [], initialGroupId = '' }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState(initialGroupId); 
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialGroupId) {
      setGroupId(initialGroupId);
    }
  }, [initialGroupId]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    // Pass the data up to the Page component
    onSubmit({ title, content, groupId, image });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 8 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Box display="flex" alignItems="center" mb={1}>
           <PostAdd color="primary" sx={{ fontSize: 30, mr: 1 }} />
           <Typography variant="h4" fontWeight="bold" color="primary">
             New Post
           </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={4}>
          Share your latest read, a review, or start a discussion.
        </Typography>

        {error && (
          <Typography color="error" fontWeight="bold" mb={2} sx={{ bgcolor: '#ffebee', p: 1, borderRadius: 1 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          
          <Box 
            sx={{ 
              border: '2px dashed #ccc', 
              borderRadius: 3, 
              p: 4, 
              textAlign: 'center', 
              mb: 3,
              cursor: 'pointer',
              bgcolor: '#fafafa',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#f0f0f0', borderColor: 'primary.main' }
            }}
            onClick={() => document.getElementById('post-image-input').click()}
          >
            {image ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <ImageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography fontWeight="bold" color="primary">
                  {image.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click to replace
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.7 }} />
                <Typography color="text.secondary" fontWeight="medium">
                  Upload Cover Image
                </Typography>
              </>
            )}
            <input 
              id="post-image-input" 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleImageChange} 
            />
          </Box>

          <TextField
            label="Title"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a catchy title"
          />

          <TextField
            select
            label="Post to a Group"
            fullWidth
            margin="normal"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            helperText="Select a group or leave empty for a public post"
          >
            <MenuItem value="">
              <em>None (Public Feed)</em>
            </MenuItem>
            {groups.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Content"
            fullWidth
            required
            margin="normal"
            multiline
            minRows={6}
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ 
               '& .MuiOutlinedInput-root': {
                 fontSize: '1.1rem',
                 lineHeight: 1.6
               }
            }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 4, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 50 }}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : 'Publish Now'}
          </Button>

        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost;