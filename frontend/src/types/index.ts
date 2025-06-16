export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publicationDate: string;
  isbn: string;
  coverImage: string;
  rating: number;
  price: number;
  pages: number;
  language: string;
  publisher: string;
}

export interface Author {
  _id: string;
  name: string;
  biography: string;
  birthDate: string;
  nationality: string;
  books: string[];
}

export interface FilterOptions {
  genre: string;
  author: string;
  minRating: number;
  maxPrice: number;
  minPrice: number;
  publicationYear: string;
  sortBy: 'title' | 'author' | 'rating' | 'publicationDate' | 'price';
  sortOrder: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters: FilterOptions;
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
  totalResults?: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
} 