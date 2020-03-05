import { Router } from 'express';
import RestaurantRouter from './Restaurants';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/restaurant', RestaurantRouter);

// Export the base-router
export default router;
