import axios from 'axios';
import type { Book, ApiResponse, SearchParams } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookApi = {
  // Get all books with optional filters
  getBooks: async (params?: Partial<SearchParams>): Promise<ApiResponse<Book[]>> => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  // Get a single book by ID
  getBookById: async (id: string): Promise<ApiResponse<Book>> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Search books
  searchBooks: async (query: string, filters?: any): Promise<ApiResponse<Book[]>> => {
    const response = await api.get('/books/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  // Get books by genre
  getBooksByGenre: async (genre: string): Promise<ApiResponse<Book[]>> => {
    const response = await api.get(`/books/genre/${genre}`);
    return response.data;
  },

  // Get books by author
  getBooksByAuthor: async (author: string): Promise<ApiResponse<Book[]>> => {
    const response = await api.get(`/books/author/${author}`);
    return response.data;
  },
};

export const authApi = {
  // Register user
  register: async (name: string, email: string, password: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Login user
  login: async (email: string, password: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: any): Promise<ApiResponse<any>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

export const userApi = {
  // Get user favorites
  getFavorites: async (): Promise<ApiResponse<Book[]>> => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  // Add book to favorites
  addToFavorites: async (bookId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/users/favorites/${bookId}`);
    return response.data;
  },

  // Remove book from favorites
  removeFromFavorites: async (bookId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/users/favorites/${bookId}`);
    return response.data;
  },

  // Get user wishlist
  getWishlist: async (): Promise<ApiResponse<Book[]>> => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },

  // Add book to wishlist
  addToWishlist: async (bookId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/users/wishlist/${bookId}`);
    return response.data;
  },

  // Remove book from wishlist
  removeFromWishlist: async (bookId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/users/wishlist/${bookId}`);
    return response.data;
  },

  // Get book reviews
  getBookReviews: async (bookId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/users/reviews/${bookId}`);
    return response.data;
  },

  // Add book review
  addReview: async (bookId: string, rating: number, comment: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/users/reviews/${bookId}`, { rating, comment });
    return response.data;
  },
};

export default api; 