import User from '../models/User.js';
import Book from '../models/Book.js';

// @desc    Add book to favorites
// @route   POST /api/users/favorites/:bookId
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if already in favorites
    const user = await User.findById(userId);
    if (user.favorites.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book already in favorites'
      });
    }

    // Add to favorites
    user.favorites.push(bookId);
    await user.save();

    res.json({
      success: true,
      message: 'Book added to favorites',
      data: user.favorites
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to favorites'
    });
  }
};

// @desc    Remove book from favorites
// @route   DELETE /api/users/favorites/:bookId
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== bookId);
    await user.save();

    res.json({
      success: true,
      message: 'Book removed from favorites',
      data: user.favorites
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from favorites'
    });
  }
};

// @desc    Add book to wishlist
// @route   POST /api/users/wishlist/:bookId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(bookId);
    await user.save();

    res.json({
      success: true,
      message: 'Book added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist'
    });
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/users/wishlist/:bookId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    await user.save();

    res.json({
      success: true,
      message: 'Book removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist'
    });
  }
};

// @desc    Add book review
// @route   POST /api/users/reviews/:bookId
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    console.log('Adding review:', { bookId, userId, rating, comment });

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      console.log('Book not found:', bookId);
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const user = await User.findById(userId);
    const existingReviewIndex = user.reviews.findIndex(
      review => review.book.toString() === bookId
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      console.log('Updating existing review');
      user.reviews[existingReviewIndex] = {
        book: bookId,
        rating,
        comment,
        createdAt: new Date()
      };
    } else {
      // Add new review
      console.log('Adding new review');
      user.reviews.push({
        book: bookId,
        rating,
        comment
      });
    }

    await user.save();
    console.log('Review saved successfully');

    res.json({
      success: true,
      message: 'Review added successfully',
      data: user.reviews
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites', 'title author coverImage rating price genre pages');

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting favorites'
    });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title author coverImage rating price genre pages');

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting wishlist'
    });
  }
};

// @desc    Get all reviews for a book
// @route   GET /api/users/reviews/:bookId
// @access  Public
export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    console.log('Getting reviews for book:', bookId);

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      console.log('Book not found:', bookId);
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Get all users who have reviewed this book
    const usersWithReviews = await User.find({
      'reviews.book': bookId
    });

    console.log('Users with reviews found:', usersWithReviews.length);

    // Extract and format reviews
    const reviews = [];
    let totalRating = 0;
    let reviewCount = 0;

    usersWithReviews.forEach(user => {
      const userReview = user.reviews.find(review => 
        review.book.toString() === bookId
      );
      
      if (userReview) {
        reviews.push({
          _id: userReview._id,
          userId: user._id,
          userName: user.name,
          rating: userReview.rating,
          comment: userReview.comment,
          createdAt: userReview.createdAt
        });
        
        totalRating += userReview.rating;
        reviewCount++;
      }
    });

    // Sort reviews by creation date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    console.log('Returning reviews:', { reviews: reviews.length, averageRating, reviewCount });

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount
      }
    });
  } catch (error) {
    console.error('Error getting book reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting book reviews'
    });
  }
}; 