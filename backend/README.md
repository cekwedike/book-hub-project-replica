# Book Hub Backend API

A robust Express.js backend API for the Book Hub application, providing comprehensive book management functionality with MongoDB integration.

## 🚀 Features

- **RESTful API** with comprehensive CRUD operations
- **MongoDB Integration** with Mongoose ODM
- **Advanced Search & Filtering** capabilities
- **Pagination** support for large datasets
- **Error Handling** with proper HTTP status codes
- **CORS** enabled for frontend integration
- **Environment Configuration** with dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/book-hub
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:5175
   API_VERSION=v1
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books with pagination and filtering |
| GET | `/api/books/:id` | Get a single book by ID |
| GET | `/api/books/search` | Search books by title, author, or description |
| GET | `/api/books/genre/:genre` | Get books by genre |
| GET | `/api/books/author/:author` | Get books by author |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### Query Parameters

#### GET /api/books
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `genre` - Filter by genre
- `author` - Filter by author (partial match)
- `minRating` - Minimum rating filter
- `maxPrice` - Maximum price filter
- `minPrice` - Minimum price filter
- `sortBy` - Field to sort by (title, author, rating, price, publicationDate)
- `sortOrder` - Sort order (asc or desc)

#### GET /api/books/search
- `q` - Search query (required)

## 📖 Usage Examples

### Get all books with pagination
```bash
GET http://localhost:5000/api/books?page=1&limit=10
```

### Search books
```bash
GET http://localhost:5000/api/books/search?q=harry potter
```

### Filter books by genre
```bash
GET http://localhost:5000/api/books?genre=Fantasy&minRating=4.5
```

### Get books by author
```bash
GET http://localhost:5000/api/books/author/J.K. Rowling
```

### Create a new book
```bash
POST http://localhost:5000/api/books
Content-Type: application/json

{
  "title": "New Book",
  "author": "Author Name",
  "description": "Book description",
  "genre": "Fiction",
  "publicationDate": "2023-01-01",
  "isbn": "978-1234567890",
  "rating": 4.5,
  "price": 19.99,
  "pages": 300,
  "publisher": "Publisher Name"
}
```

## 🗄️ Database Schema

### Book Model
```javascript
{
  title: String (required),
  author: String (required),
  description: String (required),
  genre: String (enum),
  publicationDate: Date (required),
  isbn: String (required, unique),
  coverImage: String,
  rating: Number (0-5),
  price: Number (required),
  pages: Number (required),
  language: String,
  publisher: String (required),
  inStock: Boolean,
  featured: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   └── bookController.js    # Book API logic
│   ├── data/
│   │   └── seedData.js          # Sample book data
│   ├── models/
│   │   └── Book.js              # Mongoose model
│   ├── routes/
│   │   └── bookRoutes.js        # API routes
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding script
│   └── server.js                # Main server file
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🧪 Testing

The API can be tested using tools like:
- **Postman**
- **Insomnia**
- **cURL**
- **Thunder Client (VS Code extension)**

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Adding New Features

1. Create new models in `src/models/`
2. Add controllers in `src/controllers/`
3. Define routes in `src/routes/`
4. Update the main server file to include new routes

## 🌐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5175` (Vite dev server)
- `http://localhost:3000` (Create React App)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/book-hub |
| JWT_SECRET | JWT secret key | your-super-secret-jwt-key |
| JWT_EXPIRE | JWT expiration time | 30d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5175 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 