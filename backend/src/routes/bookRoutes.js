import express from 'express';
import {
  getBooks,
  getBookById,
  searchBooks,
  getBooksByGenre,
  getBooksByAuthor,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with pagination and filtering
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books by title, author, or description
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching books
 */
router.get('/search', searchBooks);

/**
 * @swagger
 * /api/books/genre/{genre}:
 *   get:
 *     summary: Get books by genre
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Genre name
 *     responses:
 *       200:
 *         description: List of books by genre
 */
router.get('/genre/:genre', getBooksByGenre);

/**
 * @swagger
 * /api/books/author/{author}:
 *   get:
 *     summary: Get books by author
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: author
 *         schema:
 *           type: string
 *         required: true
 *         description: Author name
 *     responses:
 *       200:
 *         description: List of books by author
 */
router.get('/author/:author', getBooksByAuthor);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               genre:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *                 format: date
 *               isbn:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               pages:
 *                 type: integer
 *               language:
 *                 type: string
 *               publisher:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 */
router.post('/', createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Book updated
 */
router.put('/:id', updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete('/:id', deleteBook);

export default router; 