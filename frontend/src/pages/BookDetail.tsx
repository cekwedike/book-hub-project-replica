import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  TextField,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Share,
  Bookmark,
  BookmarkBorder,
  Person
} from '@mui/icons-material';
import { bookApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../utils/api';
import type { Book } from '../types';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface BookDetailData extends Book {
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<BookDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  useEffect(() => {
    if (book && user) {
      checkUserStatus();
    }
  }, [book, user]);

  const checkUserStatus = async () => {
    try {
      // Check if book is in favorites
      const favoritesResponse = await userApi.getFavorites();
      if (favoritesResponse.success) {
        const isInFavorites = favoritesResponse.data.some((favBook: Book) => favBook._id === book?._id);
        setIsFavorite(isInFavorites);
      }

      // Check if book is in wishlist
      const wishlistResponse = await userApi.getWishlist();
      if (wishlistResponse.success) {
        const isInWishlist = wishlistResponse.data.some((wishBook: Book) => wishBook._id === book?._id);
        setIsInWishlist(isInWishlist);
      }
    } catch (err) {
      console.error('Error checking user status:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const response = isFavorite 
        ? await userApi.removeFromFavorites(book!._id)
        : await userApi.addToFavorites(book!._id);
      
      if (response.success) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const response = isInWishlist 
        ? await userApi.removeFromWishlist(book!._id)
        : await userApi.addToWishlist(book!._id);
      
      if (response.success) {
        setIsInWishlist(!isInWishlist);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching book details for ID:', id);
      const [bookResponse, reviewsResponse] = await Promise.all([
        bookApi.getBookById(id!),
        userApi.getBookReviews(id!)
      ]);
      
      console.log('Book response:', bookResponse);
      console.log('Reviews response:', reviewsResponse);
      
      if (bookResponse.success) {
        const bookWithDetails: BookDetailData = {
          ...bookResponse.data,
          reviews: reviewsResponse.success ? reviewsResponse.data.reviews : [],
          averageRating: reviewsResponse.success ? reviewsResponse.data.averageRating : bookResponse.data.rating,
          reviewCount: reviewsResponse.success ? reviewsResponse.data.reviewCount : 0
        };
        console.log('Final book with details:', bookWithDetails);
        setBook(bookWithDetails);
      } else {
        setError('Failed to load book details');
      }
    } catch (err) {
      console.error('Error in fetchBookDetails:', err);
      setError('Error loading book details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!userRating || !reviewText.trim()) {
      setReviewError('Please provide both a rating and review text');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError(null);
      
      console.log('Submitting review:', { bookId: book!._id, rating: userRating, comment: reviewText.trim() });
      const response = await userApi.addReview(book!._id, userRating, reviewText.trim());
      console.log('Review submission response:', response);
      
      if (response.success) {
        setReviewSuccess(true);
        setUserRating(null);
        setReviewText('');
        
        console.log('Review submitted successfully, refreshing book details...');
        // Add a small delay to ensure the backend has processed the review
        setTimeout(async () => {
          await fetchBookDetails();
          console.log('Book details refreshed');
        }, 1000);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setReviewSuccess(false);
        }, 3000);
      } else {
        setReviewError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Error submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#FF6B35' }} />
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error || 'Book not found'}</Alert>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back to Books
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.3)', color: '#B0BEC5' }}
      >
        Back to Books
      </Button>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: { xs: '1', md: '0 0 400px' } }}>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <CardMedia
              component="img"
              height={400}
              image={book.coverImage}
              alt={book.title}
              sx={{ objectFit: 'cover' }}
            />
            
            <CardContent sx={{ p: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCart />}
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                  color: '#FFFFFF',
                  fontWeight: 700
                }}
              >
                Add to Cart - ${book.price}
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <IconButton onClick={handleToggleFavorite}>
                  {isFavorite ? <Favorite sx={{ color: '#FF6B35' }} /> : <FavoriteBorder />}
                </IconButton>
                <IconButton onClick={handleToggleWishlist}>
                  {isInWishlist ? <Bookmark sx={{ color: '#FF6B35' }} /> : <BookmarkBorder />}
                </IconButton>
                <IconButton onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <Share />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2 }}>
            {book.title}
          </Typography>
          
          <Typography variant="h4" sx={{ color: '#B0BEC5', mb: 3, fontStyle: 'italic' }}>
            by {book.author}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Rating
              value={book.averageRating || book.rating}
              precision={0.5}
              readOnly
              size="large"
              sx={{ mr: 2, '& .MuiRating-iconFilled': { color: '#FFD93D' } }}
            />
            <Typography variant="h6" sx={{ color: '#FFFFFF', mr: 2 }}>
              {book.averageRating || book.rating}
            </Typography>
            <Typography variant="body1" sx={{ color: '#90A4AE' }}>
              ({book.reviewCount || 0} reviews)
            </Typography>
          </Box>

          <Chip
            label={book.genre}
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
              color: '#FFFFFF',
              fontWeight: 700
            }}
          />

          <Typography variant="body1" sx={{ color: '#B0BEC5', lineHeight: 1.8, mb: 4 }}>
            {book.description}
          </Typography>

          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
            Reviews ({book.reviews?.length || 0})
          </Typography>

          <Paper sx={{
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
              Write a Review
            </Typography>
            
            {reviewError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {reviewError}
              </Alert>
            )}
            
            {reviewSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Review submitted successfully!
              </Alert>
            )}
            
            <Rating
              value={userRating}
              onChange={(_, value) => setUserRating(value)}
              size="large"
              sx={{ mb: 2, '& .MuiRating-iconFilled': { color: '#FFD93D' } }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts about this book..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              disabled={!userRating || !reviewText.trim() || submittingReview}
              onClick={handleSubmitReview}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                color: '#FFFFFF',
                fontWeight: 700
              }}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Paper>

          {book.reviews && book.reviews.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {book.reviews.map((review) => (
                <Paper
                  key={review._id}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#FF6B35' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {review.userName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#90A4AE' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Rating
                    value={review.rating}
                    readOnly
                    size="small"
                    sx={{ mb: 2, '& .MuiRating-iconFilled': { color: '#FFD93D' } }}
                  />
                  
                  <Typography variant="body1" sx={{ color: '#B0BEC5', lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: '#90A4AE', textAlign: 'center', py: 4 }}>
              No reviews yet. Be the first to review this book!
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BookDetail; 