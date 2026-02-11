import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Button, Divider, Paper, Stack, 
  CircularProgress, Card, CardContent, CardMedia, Dialog, 
  DialogTitle, DialogActions
} from '@mui/material';
import { AccessTime, Person, ArrowBack, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; 
import { useSocket } from "../context/SocketContext";
import { TextField, List, ListItem, ListItemText } from "@mui/material";

const CommentItem = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);

  const isLong = comment.text.length > 100;
  const displayText = expanded ? comment.text : comment.text.slice(0, 100);
  return (
    <ListItem alignItems="flex-start" sx={{bgcolor: 'white', mb: 1, borderRadius: 2,boxShadow: '0 1px 3px rgba(0,0,0,0.05'}}>
      <ListItemText primary = {
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" fontWeight="bold" color="primary.main">{comment.postedBy?.name || "User"}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.created || Date.now()).toLocaleDateString()}
          </Typography>
        </Box>
      } secondary={
        <>
          <Typography component="span" variant="body2" color="text.primary" sx={{display: 'block', mt: 0.5}}>{displayText}
            {isLong && !expanded && "..."}
          </Typography>

          {/* Toggle Button */}
          {isLong && (
            <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ p: 0, minWidth: 'auto', textTransform: 'none', mt: 0.5}}>
              {expanded ? "Show Less" : "Read More"}
            </Button>
          )}
        </>
      }/>
    </ListItem> 
  );
};

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/${postId}`)
      .then(res => {
        setPost(res.data);
        setComments(res.data.comments || []);
  })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [postId]);

  // SOCKET LOGIC
  useEffect(() => {
    if(!socket) return;

    console.log("FRONTEND : joining room:", postId);

    // Join a "Room" to  this specific post
    socket.emit("join_post", postId);

    // Listen for new comment
    const handleNewComment = (newComment) => {
      console.log("FRONTEND: Received new comment", newComment);
      setComments((prev) => {
        if(prev.some(c => c._id === newComment._id)) {
          return prev;
        }
        return [...prev, newComment]
      });
    };

    socket.on("new_comment", handleNewComment);

    // cleanup
    return () => {
      socket.emit("leave_post", postId);
      socket.off("new_comment", handleNewComment);
    };
  }, [socket, postId]);

  // Handle Submit
  const submitComment = async () => {
    if(!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      // Saving to DB
      
      const { data: newComment } = await axios.put(`/api/posts/${postId}/comment`,
        {text: commentText },
        {headers: {Authorization: `Bearer ${token}`}}
      );

      setComments((prev) => [...prev, newComment]);
      setCommentText(""); 
    } catch (err) {
      console.error("failed to post comment");
    }
  };

  // Handle Delete Action
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/posts'); // Redirect to All Posts after delete
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  if (loading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
  if (!post) return <Typography align="center" mt={10}>Post not found</Typography>;

  // Authorization Check
  // Handle case where author is populated object OR just an ID string
  const authorId = post.author?._id || post.author;
  const isOwner = user && (authorId === user._id);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, bgcolor: 'white', borderRadius: 4, border: '1px solid #e0e0e0' }}>
        
        {/* Post Image */}
        {post.imageUrl && (
          <Box 
            sx={{ 
              width: '100%', 
              maxHeight: '500px', 
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
            />
          </Box>
        )}

        {/* Header Section */}
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
          {post.title}
        </Typography>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2} 
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          <Stack direction="row" spacing={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Person fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {post.author?.name || 'Unknown'}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime fontSize="small" />
              <Typography variant="body2">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>

          {/* Action Buttons (Only for Owner) */}
          {isOwner && (
            <Box>
              <Button 
                startIcon={<Edit />} 
                onClick={() => navigate(`/edit-post/${postId}`)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button 
                startIcon={<Delete />} 
                color="error" 
                onClick={() => setOpenDelete(true)}
              >
                Delete
              </Button>
            </Box>
          )}
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Content Section */}
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

      <Paper elevation={0} sx={{ p: 3, mt: 4, bgcolor: '#f8f9fa', borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Comments ({comments.length})
        </Typography>
        
        <List sx={{ mb: 2 }}>
          {comments.map((c, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ bgcolor: 'white', mb: 1, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <ListItemText
                primary={c.postedBy?.name || "User"}
                secondary={c.text}
                primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main', variant: 'subtitle2' }}
                secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', mt: 0.5 }}
              />
            </ListItem>
          ))}
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No comments yet. Be the first to share your thoughts!
            </Typography>
          )}
        </List>

        {/* Comment Input Area */}
        {user ? (
          <Box display="flex" gap={2} mt={2}>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Write a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ bgcolor: 'white' }}
            />
            <Button variant="contained" onClick={submitComment} sx={{ px: 4 }}>
              Post
            </Button>
          </Box>
        ) : (
          <Box textAlign="center" py={2}>
            <Typography variant="body2" color="text.secondary">
              Please <Button onClick={() => navigate('/signin')}>Sign In</Button> to comment.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetail;