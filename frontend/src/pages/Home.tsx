import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Fab,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { FilterList, Refresh, AutoAwesome } from '@mui/icons-material';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../utils/api';
import BookCard from '../components/BookCard';
import FilterSidebar from '../components/FilterSidebar';
import type { Book } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  initialSearchQuery?: string;
}

const Home: React.FC<HomeProps> = ({ initialSearchQuery = '' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [userWishlist, setUserWishlist] = useState<string[]>([]);

  // Use the custom hook for all book data and actions
  const {
    books,
    loading,
    error,
    filters,
    pagination,
    fetchBooks,
    searchBooks,
    loadMoreBooks,
    loadMoreSearchResults,
    updateFilters,
    setFilters,
    resetPagination
  } = useBooks();

  // Handle search from Header component
  useEffect(() => {
    const handleGlobalSearch = (event: CustomEvent) => {
      const query = event.detail;
      handleSearch(query);
    };

    window.addEventListener('globalSearch', handleGlobalSearch as EventListener);
    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch as EventListener);
    };
  }, []);

  // Handle initial search query
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery !== searchQuery) {
      setSearchQuery(initialSearchQuery);
      handleSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Fetch user favorites and wishlist
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch favorites
      const favoritesResponse = await userApi.getFavorites();
      if (favoritesResponse.success) {
        setUserFavorites(favoritesResponse.data.map((book: Book) => book._id));
      }

      // Fetch wishlist
      const wishlistResponse = await userApi.getWishlist();
      if (wishlistResponse.success) {
        setUserWishlist(wishlistResponse.data.map((book: Book) => book._id));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    try {
      const isFavorite = userFavorites.includes(bookId);
      const response = isFavorite 
        ? await userApi.removeFromFavorites(bookId)
        : await userApi.addToFavorites(bookId);
      
      if (response.success) {
        setUserFavorites(prev => 
          isFavorite 
            ? prev.filter(id => id !== bookId)
            : [...prev, bookId]
        );
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleWishlist = async (bookId: string) => {
    try {
      const isInWishlist = userWishlist.includes(bookId);
      const response = isInWishlist 
        ? await userApi.removeFromWishlist(bookId)
        : await userApi.addToWishlist(bookId);
      
      if (response.success) {
        setUserWishlist(prev => 
          isInWishlist 
            ? prev.filter(id => id !== bookId)
            : [...prev, bookId]
        );
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    resetPagination();
    if (query.trim()) {
      searchBooks(query);
    } else {
      fetchBooks({ filters });
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
    resetPagination();
    // fetchBooks will be triggered by useEffect in the hook
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      genre: '',
      author: '',
      minRating: 0,
      maxPrice: 1000,
      minPrice: 0,
      publicationYear: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
    resetPagination();
    fetchBooks();
  };

  // Book click handler (for future detail page)
  const handleBookClick = (book: Book) => {
    navigate(`/book/${book._id}`);
  };

  // Refresh books
  const handleRefresh = () => {
    resetPagination();
    if (searchQuery.trim()) {
      searchBooks(searchQuery);
    } else {
      fetchBooks({ filters });
    }
  };

  // Load more books
  const handleLoadMore = () => {
    if (searchQuery.trim()) {
      loadMoreSearchResults(searchQuery);
    } else {
      loadMoreBooks();
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'transparent',
      pb: { xs: 8, sm: 4 },
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 } }}>
        {/* Hero Section */}
        <Box sx={{
          textAlign: 'center',
          mb: { xs: 4, sm: 6, lg: 8 },
          mt: { xs: 3, sm: 4, md: 6 },
          position: 'relative',
        }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem', xl: '4.5rem' },
              background: 'linear-gradient(135deg, #FF6B35, #FFD93D)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Book Hub
          </Typography>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              color: '#B0BEC5',
              fontWeight: 400,
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '1.8rem' },
              fontStyle: 'italic',
            }}
          >
            Where Stories Come Alive
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#90A4AE',
              fontSize: { xs: '1rem', sm: '1.1rem', lg: '1.2rem' },
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover your next favorite book from our curated collection of {pagination.totalItems} books, 
            including African literature and timeless classics.
          </Typography>
          
          {/* Decorative elements */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mt: 4,
            opacity: 0.6 
          }}>
            <AutoAwesome sx={{ color: '#FF6B35', fontSize: 24 }} />
            <AutoAwesome sx={{ color: '#FFD93D', fontSize: 24 }} />
            <AutoAwesome sx={{ color: '#FF6B35', fontSize: 24 }} />
          </Box>
        </Box>

        {/* Results & Filter Bar */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          mb: 4,
          gap: { xs: 2, sm: 0 },
          p: 3,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '0.95rem', sm: '1rem', lg: '1.1rem' },
              color: '#B0BEC5',
              fontWeight: 500,
            }}
          >
            {searchQuery.trim() 
              ? `Found ${pagination.totalItems} books for "${searchQuery}"`
              : pagination.totalItems > 0
                ? `Showing ${books.length} of ${pagination.totalItems} books`
                : 'No books found'
            }
            {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              startIcon={<FilterList />}
              onClick={() => setFilterSidebarOpen(true)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                minWidth: 120,
              }}
            >
              Filters
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? 'Refresh' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && books.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            py: 12,
            gap: 3
          }}>
            <CircularProgress 
              size={60} 
              sx={{ 
                color: '#FF6B35',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Typography variant="body1" color="text.secondary">
              Loading your next favorite books...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Books Grid */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)'
              },
              gap: { xs: 3, sm: 4, lg: 5, xl: 6 },
              width: '100%',
              mb: 6,
            }}>
              {books.map((book) => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  onClick={handleBookClick}
                  isFavorite={userFavorites.includes(book._id)}
                  isInWishlist={userWishlist.includes(book._id)}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </Box>

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 6 
              }}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={loading}
                  size="large"
                  sx={{
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                    boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E64A19, #FF6B35)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 107, 53, 0.3)',
                      transform: 'none',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {loading ? 'Loading...' : 'Load More Books'}
                </Button>
              </Box>
            )}

            {/* Loading indicator for pagination */}
            {loading && books.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 4 
              }}>
                <CircularProgress 
                  size={40} 
                  sx={{ color: '#FF6B35' }} 
                />
              </Box>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 12,
            px: 4
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                color: '#B0BEC5',
                fontWeight: 600,
              }}
            >
              No books found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#90A4AE',
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              Try adjusting your search or filters to discover more amazing books
            </Typography>
          </Box>
        )}

        {/* Filter Sidebar */}
        <FilterSidebar
          open={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Mobile Filter FAB */}
        <Fab
          color="primary"
          aria-label="filter"
          onClick={() => setFilterSidebarOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 24, sm: 32 },
            right: { xs: 24, sm: 32 },
            display: { xs: 'flex', sm: 'none' },
            zIndex: 1000,
            background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
            boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E64A19, #FF6B35)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <FilterList />
        </Fab>
      </Container>
    </Box>
  );
};

export default Home; 