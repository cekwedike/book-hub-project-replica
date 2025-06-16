import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  addToWishlist,
  removeFromWishlist,
  addReview,
  getBookReviews,
  getFavorites,
  getWishlist
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route for getting book reviews
router.get('/reviews/:bookId', getBookReviews);

// All other routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite books
 */
router.get('/favorites', getFavorites);

/**
 * @swagger
 * /api/users/favorites/{bookId}:
 *   post:
 *     summary: Add book to favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book added to favorites
 */
router.post('/favorites/:bookId', addToFavorites);

/**
 * @swagger
 * /api/users/favorites/{bookId}:
 *   delete:
 *     summary: Remove book from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from favorites
 */
router.delete('/favorites/:bookId', removeFromFavorites);

/**
 * @swagger
 * /api/users/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist books
 */
router.get('/wishlist', getWishlist);

/**
 * @swagger
 * /api/users/wishlist/{bookId}:
 *   post:
 *     summary: Add book to wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book added to wishlist
 */
router.post('/wishlist/:bookId', addToWishlist);

/**
 * @swagger
 * /api/users/wishlist/{bookId}:
 *   delete:
 *     summary: Remove book from wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from wishlist
 */
router.delete('/wishlist/:bookId', removeFromWishlist);

/**
 * @swagger
 * /api/users/reviews/{bookId}:
 *   post:
 *     summary: Add book review
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review added successfully
 */
router.post('/reviews/:bookId', addReview);

export default router; 