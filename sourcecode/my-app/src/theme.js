// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue - for buttons, links, active states
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed', // Purple - for secondary actions
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    success: {
      main: '#10b981', // Green - for device active/healthy
    },
    warning: {
      main: '#f59e0b', // Amber - for warnings/caution
    },
    error: {
      main: '#ef4444', // Red - for errors/threats/anomalies
    },
    background: {
      default: '#f9fafb', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Dark gray text
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
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
          fontWeight: 500,
        },
      },
    },
  },
})

export default theme