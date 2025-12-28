import { Router } from 'express';
import { isAuthenticated, hasRole } from '../middleware/auth.js';
import { createVenue, getAllVenues, getVenueById, updateVenue, deleteVenue } from '../controllers/venueController.js';

const router = Router();

// Public routes
router.get('/', getAllVenues);
router.get('/:id', getVenueById);

// Protected routes
router.post('/', isAuthenticated, hasRole(['admin', 'organizer']), createVenue);
router.put('/:id', isAuthenticated, hasRole('admin'), updateVenue);
router.delete('/:id', isAuthenticated, hasRole('admin'), deleteVenue);

export default router;
