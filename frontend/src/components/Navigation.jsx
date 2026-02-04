import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Container, IconButton, InputBase, Box, Menu, MenuItem, Stack, Tooltip
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  AccountCircle as AccountCircleIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  PostAdd // New Icon
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';

// --- Styled Components---
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)((({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '30ch' },
  },
})));

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  const handleMobileMenuOpen = (event) => setMobileAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileAnchorEl(null);

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ bgcolor: 'background.default', py: 1 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 }, mr: { md: 4 }, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" noWrap sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, fontWeight: 800, color: 'secondary.main', textDecoration: 'none' }}>
              Reader's Club
            </Typography>
          </Box>

          {/* Desktop Search */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase placeholder="Search posts, groups..." inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Button color="primary" onClick={() => navigate('/groups')} sx={{ fontSize: '1rem', fontWeight: 600 }}>Groups</Button>
            <Button color="primary" onClick={() => navigate('/posts')} sx={{ fontSize: '1rem', fontWeight: 600 }}>Posts</Button>

            {!user ? (
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="primary" onClick={() => navigate('/signin')}>Sign In</Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip title="Write a new post">
                  <IconButton 
                    color="primary" 
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                    onClick={() => navigate('/create-post')}
                  >
                    <PostAdd />
                  </IconButton>
                </Tooltip>

                <Button 
                  startIcon={<AccountCircleIcon />} 
                  onClick={() => navigate('/profile')}
                  sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                >
                  {user.name.split(' ')[0]} 
                </Button>
              </Stack>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleMobileMenuOpen} color="inherit">
              <MenuIcon color="primary" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Dropdown */}
      <Menu
        id="mobile-menu"
        anchorEl={mobileAnchorEl}
        keepMounted
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
        PaperProps={{ sx: { width: '200px', mt: 1.5 } }}
      >
        <MenuItem onClick={() => { navigate('/groups'); handleMobileMenuClose(); }}>Groups</MenuItem>
        <MenuItem onClick={() => { navigate('/posts'); handleMobileMenuClose(); }}>Posts</MenuItem>
        {user && (
           <MenuItem onClick={() => { navigate('/create-post'); handleMobileMenuClose(); }}>
             <strong>Write Post</strong>
           </MenuItem>
        )}
        <MenuItem onClick={() => { navigate(user ? '/profile' : '/signin'); handleMobileMenuClose(); }}>
          {user ? 'My Profile' : 'Sign In'}
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navigation;