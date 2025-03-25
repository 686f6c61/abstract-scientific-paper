import { createTheme } from '@mui/material/styles';

// Light color theme with clean, soft colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6096B4', // Soft blue
      light: '#93BFCF',
      dark: '#4682A9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#EEE9DA', // Soft cream
      light: '#F8F6F4',
      dark: '#BDCDD6',
      contrastText: '#424242',
    },
    background: {
      default: '#F8F6F4', // Very light cream
      paper: '#FFFFFF',   // Clean white
    },
    text: {
      primary: '#424242', // Dark gray
      secondary: '#757575', // Medium gray
    },
    error: {
      main: '#F87474', // Soft red
    },
    warning: {
      main: '#F9B572', // Soft orange
    },
    info: {
      main: '#8EACD0', // Soft light blue
    },
    success: {
      main: '#AAC8A7', // Soft green
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'visible',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
