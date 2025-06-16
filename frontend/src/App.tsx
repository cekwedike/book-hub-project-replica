import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header.tsx';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import Wishlist from './pages/Wishlist';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B35',
      light: '#FF8A65',
      dark: '#E64A19',
    },
    secondary: {
      main: '#FFD93D',
      light: '#FFE082',
      dark: '#FFB300',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      background: 'linear-gradient(135deg, #FF6B35, #FFD93D)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#FFFFFF',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.8rem',
      color: '#FFFFFF',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#FFFFFF',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#B0BEC5',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#90A4AE',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E64A19, #FF6B35)',
          },
        },
        outlined: {
          borderColor: '#FF6B35',
          color: '#FF6B35',
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            borderColor: '#FF8A65',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Dispatch a custom event for the Home component to listen to
    window.dispatchEvent(new CustomEvent('globalSearch', { detail: query }));
  };

  const handleMenuClick = () => {
    // Handle mobile menu if needed
    console.log('Menu clicked');
  };

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: '100vh',
              width: '100vw',
              background: `
                radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 217, 61, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
                linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 25%, #0F0F0F 50%, #1A1A1A 75%, #0A0A0A 100%)
              `,
              position: 'relative',
              overflowX: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 10% 20%, rgba(255, 107, 53, 0.03) 0%, transparent 20%),
                  radial-gradient(circle at 90% 80%, rgba(255, 217, 61, 0.03) 0%, transparent 20%),
                  radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.02) 0%, transparent 30%)
                `,
                pointerEvents: 'none',
              },
            }}
          >
            <Routes>
              {/* Public route - Auth page */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/" element={
                <ProtectedRoute>
                  <>
                    <Header 
                      onSearch={handleSearch}
                      onMenuClick={handleMenuClick}
                    />
                    <Home initialSearchQuery={searchQuery} />
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/book/:id" element={
                <ProtectedRoute>
                  <>
                    <Header 
                      onSearch={handleSearch}
                      onMenuClick={handleMenuClick}
                    />
                    <BookDetail />
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <>
                    <Header 
                      onSearch={handleSearch}
                      onMenuClick={handleMenuClick}
                    />
                    <Favorites />
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <>
                    <Header 
                      onSearch={handleSearch}
                      onMenuClick={handleMenuClick}
                    />
                    <Wishlist />
                  </>
                </ProtectedRoute>
              } />
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 