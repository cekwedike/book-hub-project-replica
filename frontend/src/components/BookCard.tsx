import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Book as BookIcon, 
  Star,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  isFavorite?: boolean;
  isInWishlist?: boolean;
  onToggleFavorite?: (bookId: string) => void;
  onToggleWishlist?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onClick, 
  isFavorite = false, 
  isInWishlist = false,
  onToggleFavorite,
  onToggleWishlist
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const { user } = useAuth();

  const handleClick = () => {
    if (onClick) {
      onClick(book);
    } else {
      // Navigate to book detail page
      navigate(`/book/${book._id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(book._id);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(book._id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 217, 61, 0.1))',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        },
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(255, 107, 53, 0.3), 0 0 40px rgba(255, 217, 61, 0.2)',
          cursor: 'pointer',
          borderColor: 'rgba(255, 107, 53, 0.3)',
          '&::before': {
            opacity: 1,
          },
          '& .book-cover': {
            transform: 'scale(1.05)',
          },
          '& .book-title': {
            color: '#FF6B35',
          },
          '& .action-buttons': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        }
      }}
      onClick={handleClick}
    >
      {/* Action Buttons Overlay */}
      {user && (
        <Box 
          className="action-buttons"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 10,
            opacity: 0,
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
          }}
        >
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: isFavorite ? '#FF6B35' : '#B0BEC5',
              '&:hover': {
                background: 'rgba(255, 107, 53, 0.2)',
                borderColor: '#FF6B35',
              }
            }}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            onClick={handleWishlistClick}
            sx={{
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: isInWishlist ? '#FF6B35' : '#B0BEC5',
              '&:hover': {
                background: 'rgba(255, 107, 53, 0.2)',
                borderColor: '#FF6B35',
              }
            }}
          >
            {isInWishlist ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Box>
      )}

      <CardMedia
        component="img"
        height="280"
        image={book.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover'}
        alt={book.title}
        className="book-cover"
        sx={{ 
          objectFit: 'cover',
          width: '100%',
          height: 280,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
            pointerEvents: 'none',
          }
        }}
      />
      
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box>
          <Typography 
            variant="h6" 
            component="h3" 
            className="book-title"
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem', lg: '1.2rem' },
              lineHeight: 1.3,
              mb: 1.5,
              color: '#FFFFFF',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.6rem',
              transition: 'color 0.3s ease',
            }}
          >
            {book.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.9rem', lg: '1rem' },
              color: '#B0BEC5',
              fontStyle: 'italic',
            }}
          >
            by {book.author}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating 
              value={book.rating || 0} 
              precision={0.5} 
              size="small"
              readOnly
              sx={{ 
                mr: 1,
                '& .MuiRating-iconFilled': {
                  color: '#FFD93D',
                },
                '& .MuiRating-iconEmpty': {
                  color: 'rgba(255, 217, 61, 0.3)',
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#90A4AE',
                fontWeight: 600,
              }}
            >
              {book.rating || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 3, 
            flexWrap: 'wrap'
          }}>
            <Chip 
              label={book.genre || 'Unknown'} 
              size="small"
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                '&:hover': {
                  background: 'linear-gradient(135deg, #E64A19, #FF6B35)',
                }
              }}
            />
            <Chip 
              label={`${book.pages || 'N/A'} pages`} 
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255, 107, 53, 0.5)',
                color: '#B0BEC5',
                fontSize: '0.75rem',
                height: 28,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                }
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto',
          pt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FF6B35', 
              fontWeight: 800,
              fontSize: { xs: '1.3rem', sm: '1.4rem', lg: '1.5rem' },
              textShadow: '0 2px 4px rgba(255, 107, 53, 0.3)',
            }}
          >
            ${book.price || 'N/A'}
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            startIcon={<BookIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleClick();
            }}
            sx={{ 
              background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E64A19, #FF6B35)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard; 