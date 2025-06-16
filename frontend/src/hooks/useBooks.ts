import { useState, useEffect } from 'react';
import type { Book, SearchParams, FilterOptions } from '../types';
import { bookApi } from '../utils/api';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState<FilterOptions>({
    genre: '',
    author: '',
    minRating: 0,
    maxPrice: 1000,
    minPrice: 0,
    publicationYear: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const fetchBooks = async (searchParams?: Partial<SearchParams>, page = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...searchParams,
        page,
        limit: 12, // Show 12 books per page
        ...filters
      };
      
      const response = await bookApi.getBooks(params);
      if (response.success) {
        if (append) {
          setBooks(prev => [...prev, ...response.data]);
        } else {
          setBooks(response.data);
        }
        
        // Update pagination from the pagination object in response
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
            totalItems: response.pagination.totalItems,
            hasNextPage: response.pagination.hasNextPage,
            hasPrevPage: response.pagination.hasPrevPage
          });
        } else {
          // Fallback if pagination object is not available
          setPagination({
            currentPage: page,
            totalPages: 1,
            totalItems: response.data.length,
            hasNextPage: false,
            hasPrevPage: false
          });
        }
      } else {
        setError(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (query: string, page = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q: query,
        page,
        limit: 12,
        ...filters
      };
      
      const response = await bookApi.searchBooks(query, params);
      if (response.success) {
        if (append) {
          setBooks(prev => [...prev, ...response.data]);
        } else {
          setBooks(response.data);
        }
        
        // Use pagination data from backend response
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
            totalItems: response.pagination.totalItems,
            hasNextPage: response.pagination.hasNextPage,
            hasPrevPage: response.pagination.hasPrevPage
          });
        } else {
          // Fallback if pagination object is not available
          const totalResults = response.totalResults || response.data.length;
          const totalPages = Math.ceil(totalResults / 12);
          
          setPagination({
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalResults,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          });
        }
      } else {
        setError(response.message || 'Failed to search books');
      }
    } catch (err) {
      setError('Failed to search books. Please try again later.');
      console.error('Error searching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBooks = async () => {
    if (pagination.hasNextPage && !loading) {
      const nextPage = pagination.currentPage + 1;
      await fetchBooks({ filters }, nextPage, true);
    }
  };

  const loadMoreSearchResults = async (query: string) => {
    if (pagination.hasNextPage && !loading) {
      const nextPage = pagination.currentPage + 1;
      await searchBooks(query, nextPage, true);
    }
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetPagination = () => {
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false
    });
  };

  useEffect(() => {
    fetchBooks({ filters });
  }, [filters]);

  return {
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
  };
}; 