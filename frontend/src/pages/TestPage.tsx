import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const TestPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Test Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        User: {user ? user.name : 'Not logged in'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {user ? user.email : 'N/A'}
      </Typography>
      <Button 
        variant="contained" 
        onClick={logout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default TestPage; 