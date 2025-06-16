import Book from '../models/Book.js';

// @desc    Get all books with pagination and filtering
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }
    
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }
    
    if (req.query.minRating) {
      filter.rating = { $gte: parseFloat(req.query.minRating) };
    }
    
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }
    
    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
    }

    // Build sort object
    let sort = {};
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[req.query.sortBy] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }

    const books = await Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books'
    });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select('-__v');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book'
    });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = { $regex: q, $options: 'i' };
    
    // Get total count for pagination
    const total = await Book.countDocuments({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { genre: searchRegex }
      ]
    });

    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { genre: searchRegex }
      ]
    })
    .skip(skip)
    .limit(limit)
    .select('-__v');

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: books,
      totalResults: total,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching books'
    });
  }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genre
// @access  Public
export const getBooksByGenre = async (req, res) => {
  try {
    const books = await Book.find({ 
      genre: { $regex: req.params.genre, $options: 'i' } 
    }).select('-__v');

    res.json({
      success: true,
      data: books,
      totalResults: books.length
    });
  } catch (error) {
    console.error('Error fetching books by genre:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books by genre'
    });
  }
};

// @desc    Get books by author
// @route   GET /api/books/author/:author
// @access  Public
export const getBooksByAuthor = async (req, res) => {
  try {
    const books = await Book.find({ 
      author: { $regex: req.params.author, $options: 'i' } 
    }).select('-__v');

    res.json({
      success: true,
      data: books,
      totalResults: books.length
    });
  } catch (error) {
    console.error('Error fetching books by author:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books by author'
    });
  }
};

// @desc    Create new book (for testing/admin)
// @route   POST /api/books
// @access  Public (for now, should be private in production)
export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    
    res.status(201).json({
      success: true,
      data: savedBook
    });
  } catch (error) {
    console.error('Error creating book:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating book'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public (for now, should be private in production)
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating book'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public (for now, should be private in production)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
}; 