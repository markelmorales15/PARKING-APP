import express from 'express';
import { createReview, getGarageReviews } from '../controllers/reviewController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', verifyToken, createReview);

// Get reviews for a garage (protected for now)
// Note: Consider if garage reviews should be public or protected. Protecting for now.
router.get('/garage/:garageId', verifyToken, getGarageReviews);

export default router;
import express from 'express';
import { createReview, getGarageReviews } from '../controllers/reviewController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', verifyToken, createReview);

// Get reviews for a garage (protected for now)
// Note: Consider if garage reviews should be public or protected. Protecting for now.
router.get('/garage/:garageId', verifyToken, getGarageReviews);

export default router;
import express from 'express';
import { createReview, getGarageReviews } from '../controllers/reviewController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', verifyToken, createReview);

// Get reviews for a garage (protected for now)
router.get('/garage/:garageId', verifyToken, getGarageReviews);

export default router;
import express from 'express';
import { createReview, getGarageReviews } from '../controllers/reviewController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', verifyToken, createReview);

// Get reviews for a garage (protected for now)
// Note: Consider if garage reviews should be public or protected. Protecting for now.
router.get('/garage/:garageId', verifyToken, getGarageReviews);

export default router;
import express from 'express';
import { createReview, getGarageReviews } from '../controllers/reviewController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', verifyToken, createReview);

// Get reviews for a garage (protected for now)
router.get('/garage/:garageId', verifyToken, getGarageReviews);

export default router;
import express from 'express';
import { createReview, getGarageReviews } from '../controllers/reviewController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new review (protected)
router.post('/', verifyToken, createReview);

// Get reviews for a garage (public - potentially, depending on requirements, but protected for consistency)
// Note: Consider if garage reviews should be public or protected. Protecting for now.
router.get('/garage/:garageId', verifyToken, getGarageReviews);

export default router;