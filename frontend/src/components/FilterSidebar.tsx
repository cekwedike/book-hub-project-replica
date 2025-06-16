import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  filters: {
    genre: string;
    author: string;
    minRating: number;
    maxPrice: number;
    minPrice: number;
    publicationYear: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    if (isMobile) {
      onClose();
    }
  };

  const handleClearAll = () => {
    const clearedFilters = {
      genre: '',
      author: '',
      minRating: 0,
      maxPrice: 1000,
      minPrice: 0,
      publicationYear: '',
      sortBy: 'title',
      sortOrder: 'asc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const genres = [
    'Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy',
    'Thriller', 'Historical Fiction', 'Biography', 'Self-Help',
    'African Literature', 'Poetry', 'Drama', 'Non-Fiction'
  ];

  const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      variant={isMobile ? 'temporary' : 'persistent'}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400, md: 450 },
          height: { xs: '80vh', sm: '100vh' },
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderLeft: { xs: 'none', sm: '1px solid rgba(255, 255, 255, 0.1)' },
          borderTop: { xs: '1px solid rgba(255, 255, 255, 0.1)', sm: 'none' },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 217, 61, 0.05))',
      }}>
        {/* Header */}
        <Box sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
            }}>
              <FilterIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: '#FFFFFF',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Filters
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#B0BEC5',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              '&:hover': {
                color: '#FF6B35',
                background: 'rgba(255, 107, 53, 0.1)',
                borderColor: 'rgba(255, 107, 53, 0.3)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {/* Genre Filter */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Genre
            </Typography>
            <FormControl fullWidth>
              <Select
                value={localFilters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                displayEmpty
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: 'rgba(255, 107, 53, 0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#FF6B35',
                  },
                  '& .MuiSelect-icon': {
                    color: '#B0BEC5',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                }}
              >
                <MenuItem value="" sx={{ color: '#90A4AE' }}>
                  All Genres
                </MenuItem>
                {genres.map((genre) => (
                  <MenuItem 
                    key={genre} 
                    value={genre}
                    sx={{ 
                      color: '#FFFFFF',
                      '&:hover': {
                        background: 'rgba(255, 107, 53, 0.1)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(255, 107, 53, 0.2)',
                        color: '#FF6B35',
                        fontWeight: 600,
                      }
                    }}
                  >
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Author Filter */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Author
            </Typography>
            <TextField
              fullWidth
              placeholder="Search by author..."
              value={localFilters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: 'rgba(255, 107, 53, 0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#FF6B35',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                    '&::placeholder': {
                      color: '#90A4AE',
                      opacity: 1,
                    }
                  }
                }
              }}
            />
          </Box>

          {/* Rating Filter */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Minimum Rating
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={localFilters.minRating}
                onChange={(_, value) => handleFilterChange('minRating', value)}
                min={0}
                max={5}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2.5, label: '2.5' },
                  { value: 5, label: '5' }
                ]}
                sx={{
                  color: '#FF6B35',
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                    }
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                  },
                  '& .MuiSlider-rail': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiSlider-markLabel': {
                    color: '#B0BEC5',
                    fontSize: '0.875rem',
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                label={`${localFilters.minRating}+ stars`}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              />
            </Box>
          </Box>

          {/* Price Range */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Price Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Min Price"
                type="number"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 53, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#FF6B35',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B0BEC5',
                      '&.Mui-focused': {
                        color: '#FF6B35',
                      }
                    }
                  }
                }}
              />
              <TextField
                label="Max Price"
                type="number"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 53, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#FF6B35',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B0BEC5',
                      '&.Mui-focused': {
                        color: '#FF6B35',
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Publication Year */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Publication Year
            </Typography>
            <FormControl fullWidth>
              <Select
                value={localFilters.publicationYear}
                onChange={(e) => handleFilterChange('publicationYear', e.target.value)}
                displayEmpty
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: 'rgba(255, 107, 53, 0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#FF6B35',
                  },
                  '& .MuiSelect-icon': {
                    color: '#B0BEC5',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                }}
              >
                <MenuItem value="" sx={{ color: '#90A4AE' }}>
                  Any Year
                </MenuItem>
                {years.map((year) => (
                  <MenuItem 
                    key={year} 
                    value={year}
                    sx={{ 
                      color: '#FFFFFF',
                      '&:hover': {
                        background: 'rgba(255, 107, 53, 0.1)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(255, 107, 53, 0.2)',
                        color: '#FF6B35',
                        fontWeight: 600,
                      }
                    }}
                  >
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Sort Options */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Sort By
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <Select
                  value={localFilters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 53, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#FF6B35',
                    },
                    '& .MuiSelect-icon': {
                      color: '#B0BEC5',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                >
                  <MenuItem value="title" sx={{ color: '#FFFFFF' }}>Title</MenuItem>
                  <MenuItem value="author" sx={{ color: '#FFFFFF' }}>Author</MenuItem>
                  <MenuItem value="rating" sx={{ color: '#FFFFFF' }}>Rating</MenuItem>
                  <MenuItem value="price" sx={{ color: '#FFFFFF' }}>Price</MenuItem>
                  <MenuItem value="publicationYear" sx={{ color: '#FFFFFF' }}>Year</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <Select
                  value={localFilters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 53, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#FF6B35',
                    },
                    '& .MuiSelect-icon': {
                      color: '#B0BEC5',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                >
                  <MenuItem value="asc" sx={{ color: '#FFFFFF' }}>Ascending</MenuItem>
                  <MenuItem value="desc" sx={{ color: '#FFFFFF' }}>Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: 2,
        }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            fullWidth
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#B0BEC5',
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#FF6B35',
                color: '#FF6B35',
                background: 'rgba(255, 107, 53, 0.1)',
              }
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleApplyFilters}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
              color: '#FFFFFF',
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E64A19, #FF6B35)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FilterSidebar; 