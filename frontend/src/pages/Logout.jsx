import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const colors = {
  caribbeanCurrent: '#006d77ff',
};

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/signin');
  }, [logout, navigate]);

  return (
    <Box sx={{ textAlign: 'center', mt: 12 }}>
      <CircularProgress sx={{ color: colors.caribbeanCurrent }} size={70} />
      <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold', color: colors.caribbeanCurrent }}>
        Logging out...
      </Typography>
    </Box>
  );
};

export default Logout;
