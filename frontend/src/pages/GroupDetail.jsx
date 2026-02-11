import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia, Stack, Paper, Skeleton,
  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText
} from '@mui/material';
import { People, PostAdd, Delete } from '@mui/icons-material'; 
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

const GroupDetail = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const flash = useFlash(); 

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gRes, pRes] = await Promise.all([
          axios.get(`/api/groups/${groupId}`),
          axios.get(`/api/groups/${groupId}/posts`)
        ]);
        setGroup(gRes.data);
        setPosts(pRes.data);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [groupId]);

  const isOwner = user && group && (
    (group.creator?._id === user._id) || (group.creator === user._id)
  );

  const isMember = group?.members?.some(member => {
      const memberId = member._id || member;
      return memberId.toString() === user?._id?.toString();
  });

  const handleJoin = async () => {
     if (!user) return flash("Please sign in to join", "error");
     try {
       const endpoint = isMember ? 'leave' : 'join';
       await axios.post(`/api/groups/${groupId}/${endpoint}`);
       
       // Refresh data
       const res = await axios.get(`/api/groups/${groupId}`);
       setGroup(res.data);
       flash(isMember ? "Left group" : "Joined group", "success");
     } catch (err) {
       flash(err.response?.data?.message || "Action failed", "error");
     }
  };

  const handleDeleteGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      flash("Group deleted successfully", "success");
      navigate('/groups'); 
    } catch (err) {
      flash(err.response?.data?.message || "Failed to delete group", "error");
      setOpenDelete(false);
    }
  };

  if (loading) return <Container sx={{ mt: 5 }}><Skeleton variant="rectangular" height={300} /></Container>;
  if (!group) return null;

  return (
    <Container maxWidth="lg">
      
      <Paper 
        elevation={0}
        sx={{ position: 'relative', mb: 6, borderRadius: 4, overflow: 'hidden', bgcolor: 'grey.200' }}
      >
        <Box 
          sx={{ 
            height: { xs: 200, md: 350 },
            width: '100%',
            background: group.imageUrl 
              ? `url(${group.imageUrl}) center/cover` 
              : 'linear-gradient(135deg, #3d405b, #81b29a)'
          }}
        />

        <Box sx={{ 
            p: 4, bgcolor: 'white', mx: { xs: 2, md: 6 }, mt: -6, borderRadius: 3,
            position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'
        }}>
          <Typography variant="h3" fontWeight="900" color="primary" gutterBottom>
            {group.name}
          </Typography>
          
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={3} color="text.secondary">
            <People fontSize="small" />
            <Typography variant="h6" fontWeight="bold">
                {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
            </Typography>
            <Typography>•</Typography>
            <Typography variant="h6">{group.theme || 'General Interest'}</Typography>
          </Stack>

          <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
            {group.description}
          </Typography>

          {/* ACTION BUTTONS */}
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
            
            {/* 1. Join/Leave Button */}
            <Button 
                variant="contained" 
                color={isMember ? "inherit" : "primary"} 
                size="large" 
                onClick={handleJoin}
                sx={{ px: 4, borderRadius: 50, fontWeight: 'bold' }}
            >
                {isMember ? 'Leave Group' : 'Join Group'}
            </Button>

            {/* 2. Post Button (Members Only) */}
            {isMember && (
                <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large" 
                    startIcon={<PostAdd />}
                    onClick={() => navigate('/create-post', { state: { groupId: group._id } })}
                    sx={{ px: 4, borderRadius: 50, fontWeight: 'bold' }}
                >
                    Post
                </Button>
            )}

            {/* 3. Delete Button (Owner Only) */}
            {isOwner && (
                <Button 
                    variant="text" 
                    color="error" 
                    size="large" 
                    startIcon={<Delete />}
                    onClick={() => setOpenDelete(true)} // Open Dialog
                    sx={{ px: 2, borderRadius: 50, fontWeight: 'bold' }}
                >
                    Delete Group
                </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Latest Discussions
      </Typography>

      <Grid container spacing={3}>
        {posts.length > 0 ? posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/posts/${post._id}`)}
            >
              {post.imageUrl && (
                <CardMedia component="img" height="180" image={post.imageUrl} sx={{ objectFit: 'cover' }} />
              )}
              <CardContent>
                <Typography variant="h6" fontWeight="bold" noWrap>{post.title}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.substring(0, 80)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Box sx={{ p: 3, width: '100%', textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6">No discussions yet.</Typography>
          </Box>
        )}
      </Grid>

      {/* 4.Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Group?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{group.name}"? This will permanently remove the group and ALL posts inside it. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteGroup} color="error" variant="contained">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default GroupDetail;