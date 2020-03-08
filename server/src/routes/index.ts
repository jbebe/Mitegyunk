import { Router } from 'express';
import RestaurantRouter from './Restaurants';
import VoteRouter from './Votes';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/restaurant', RestaurantRouter);
router.use('/vote', VoteRouter);

// Export the base-router
export default router;
