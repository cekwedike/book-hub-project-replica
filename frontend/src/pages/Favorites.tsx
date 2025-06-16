import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Favorite, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../utils/api';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userApi.getFavorites();
      
      if (response.success) {
        setFavorites(response.data);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      setError('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId: string) => {
    try {
      const response = await userApi.removeFromFavorites(bookId);
      if (response.success) {
        setFavorites(prev => prev.filter(book => book._id !== bookId));
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#FF6B35' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.3)', color: '#B0BEC5' }}
        >
          Back to Home
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Favorite sx={{ color: '#FF6B35', fontSize: 40 }} />
          <Typography variant="h2" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FF6B35, #FFD93D)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            My Favorites
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 4 }}>
          Your personal collection of beloved books
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {favorites.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Favorite sx={{ color: '#90A4AE', fontSize: 80, mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
            No favorites yet
          </Typography>
          <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 3 }}>
            Start building your collection by adding books to your favorites
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            Discover Books
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {favorites.map((book) => (
            <Box key={book._id}>
              <BookCard
                book={book}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Favorites; 