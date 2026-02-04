import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3d405b', 
      light: '#81b29a', 
    },
    secondary: {
      main: '#e07a5f', 
    },
    background: {
      default: '#f8f9fa', 
      paper: '#ffffff',
    },
    text: {
      primary: '#2b2d42',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }, 
  },
  shape: {
    borderRadius: 8, 
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;