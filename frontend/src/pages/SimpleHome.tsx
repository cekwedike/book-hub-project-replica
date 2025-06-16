import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material';

const SimpleHome: React.FC = () => {
  const mockBooks = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      coverImage: 'https://via.placeholder.com/200x300?text=The+Great+Gatsby',
      rating: 4.5,
      price: 12.99,
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      coverImage: 'https://via.placeholder.com/200x300?text=To+Kill+a+Mockingbird',
      rating: 4.8,
      price: 14.99,
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      genre: 'Science Fiction',
      coverImage: 'https://via.placeholder.com/200x300?text=1984',
      rating: 4.6,
      price: 11.99,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 4 }}>
          Discover Your Next Read
        </Typography>
        
        <Grid container spacing={3}>
          {mockBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.coverImage}
                  alt={book.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Genre: {book.genre}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${book.price}
                    </Typography>
                    <Button variant="contained" size="small">
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SimpleHome; 