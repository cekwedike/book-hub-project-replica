import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Fade,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  Search, 
  Menu as MenuIcon, 
  AutoAwesome,
  Book as BookIcon,
  Person,
  Logout,
  Favorite,
  Bookmark
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const handleNavigateToAuth = () => {
    navigate('/auth');
  };

  const handleNavigateToFavorites = React.useCallback(() => {
    handleUserMenuClose();
    navigate('/favorites');
  }, [navigate]);

  const handleNavigateToWishlist = React.useCallback(() => {
    handleUserMenuClose();
    navigate('/wishlist');
  }, [navigate]);

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 32px rgba(0, 0, 0, 0.1)',
        zIndex: 1200,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          sx={{ 
            px: { xs: 0, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            minHeight: { xs: 64, sm: 72, md: 80 },
          }}
        >
          {/* Logo & Title */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: { xs: 2, sm: 4, md: 6 },
            minWidth: 'fit-content'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              mr: 2
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 40, sm: 48, md: 56 },
                height: { xs: 40, sm: 48, md: 56 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #FF6B35, #FFD93D)',
                boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent)',
                  pointerEvents: 'none',
                }
              }}>
                <BookIcon sx={{ 
                  color: '#FFFFFF', 
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }} />
              </Box>
            </Box>
            
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
                background: 'linear-gradient(135deg, #FF6B35, #FFD93D)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' },
                whiteSpace: 'nowrap',
              }}
            >
              Book Hub
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ 
            flexGrow: 1, 
            maxWidth: { xs: '100%', sm: 600, md: 700, lg: 800 },
            mx: 'auto',
            position: 'relative',
          }}>
            <TextField
              fullWidth
              placeholder="Search for books, authors, or genres..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'rgba(255, 107, 53, 0.3)',
                    background: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#FF6B35',
                    background: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0 0 2px rgba(255, 107, 53, 0.2)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                    '&::placeholder': {
                      color: '#90A4AE',
                      opacity: 1,
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ 
                      color: isSearchFocused ? '#FF6B35' : '#90A4AE',
                      fontSize: { xs: 20, sm: 24 },
                      transition: 'color 0.3s ease'
                    }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearSearch}
                      size="small"
                      sx={{
                        color: '#90A4AE',
                        '&:hover': {
                          color: '#FF6B35',
                        }
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: '#90A4AE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          color: '#1A1A1A',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          '&:hover': {
                            background: '#FF6B35',
                            color: '#FFFFFF',
                          }
                        }}
                      >
                        ×
                      </Box>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Search Suggestions */}
            <Fade in={isSearchFocused && searchQuery.length > 0}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  mt: 1,
                  zIndex: 1300,
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <Box sx={{ p: 1 }}>
                  {['fiction', 'mystery', 'romance', 'science fiction', 'fantasy'].map((suggestion) => (
                    <Box
                      key={suggestion}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        color: '#B0BEC5',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(255, 107, 53, 0.2)',
                          transform: 'translateY(-1px)',
                        }
                      }}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        onSearch(suggestion);
                      }}
                    >
                      {suggestion}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            ml: { xs: 2, sm: 3, md: 4 },
            minWidth: 'fit-content'
          }}>
            {/* Menu Button - Mobile */}
            <IconButton
              onClick={onMenuClick}
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#B0BEC5',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: '#FF6B35',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderColor: 'rgba(255, 107, 53, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(255, 107, 53, 0.2)',
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Authentication Buttons */}
            {user ? (
              <>
                {/* User Avatar */}
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    color: '#B0BEC5',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 1.5,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      color: '#FF6B35',
                      background: 'rgba(255, 107, 53, 0.1)',
                      borderColor: 'rgba(255, 107, 53, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(255, 107, 53, 0.2)',
                    }
                  }}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#FF6B35',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                {/* User Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      background: 'rgba(26, 26, 26, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      mt: 1,
                      minWidth: 200,
                    }
                  }}
                >
                  <MenuItem sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {user.name}
                  </MenuItem>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <MenuItem onClick={handleNavigateToFavorites} sx={{ color: '#B0BEC5' }}>
                    <Favorite sx={{ mr: 2, fontSize: 20 }} />
                    My Favorites
                  </MenuItem>
                  <MenuItem onClick={handleNavigateToWishlist} sx={{ color: '#B0BEC5' }}>
                    <Bookmark sx={{ mr: 2, fontSize: 20 }} />
                    My Wishlist
                  </MenuItem>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <MenuItem onClick={handleLogout} sx={{ color: '#FF6B35' }}>
                    <Logout sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Button
                  variant="outlined"
                  onClick={handleNavigateToAuth}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    borderColor: 'rgba(255, 107, 53, 0.5)',
                    color: '#FF6B35',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#FF6B35',
                      background: 'rgba(255, 107, 53, 0.1)',
                    }
                  }}
                >
                  Sign In
                </Button>

                {/* Mobile Auth Button */}
                <IconButton
                  onClick={handleNavigateToAuth}
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    color: '#FF6B35',
                    background: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: 3,
                    p: 1.5,
                    '&:hover': {
                      background: 'rgba(255, 107, 53, 0.2)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <Person sx={{ fontSize: 24 }} />
                </IconButton>
              </>
            )}

            {/* Decorative Element */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 1,
              opacity: 0.6
            }}>
              <AutoAwesome sx={{ color: '#FF6B35', fontSize: 20 }} />
              <AutoAwesome sx={{ color: '#FFD93D', fontSize: 20 }} />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 