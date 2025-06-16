import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
      'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help',
      'Business', 'Technology', 'Cooking', 'Travel', 'Poetry'
    ]
  },
  publicationDate: {
    type: Date,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/200x300?text=No+Cover'
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pages: {
    type: Number,
    required: true,
    min: 1
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  publisher: {
    type: String,
    required: true,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Index for filtering
bookSchema.index({ genre: 1, rating: -1, price: 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book; 