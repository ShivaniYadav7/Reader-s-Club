import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, CircularProgress, Box } from '@mui/material';
import { useFlash } from '../context/FlashContext';

const EditPost = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const flash = useFlash();

    // 1. Fetch existing data
    useEffect(() => {
        axios.get(`/api/posts/${id}`)
            .then(res => {
                setTitle(res.data.title);
                setContent(res.data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                const errMsg = "Failed to load post data";
                flash(errMsg);
                setLoading(false);
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/posts/${id}`,
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/posts/${id}`);
        } catch (err) {
            console.error(err);
            const errMsg = "Update failed. Are you the author?";
            flash(errMsg);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Edit Post
                </Typography>
                <form onSubmit={handleUpdate}>
                    <TextField 
                        label="Title" 
                        fullWidth 
                        margin="normal" 
                        required
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    
                    <TextField 
                        label="Content" 
                        fullWidth 
                        margin="normal" 
                        required
                        multiline
                        rows={6}
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                    />

                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                    >
                        Update Post
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditPost;