import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert, Box, Paper } from '@mui/material';

const SignIn = () => {
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Sign In
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth label="Email Address"
            autoComplete="email" autoFocus
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <TextField
            margin="normal" required fullWidth label="Password" type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Box textAlign="center">
            <Link to="/signup" style={{ textDecoration: 'none', color: '#3d405b' }}>
              Don't have an account? <strong>Sign Up</strong>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;