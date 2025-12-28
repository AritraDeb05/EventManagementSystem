import { Router } from 'express';
import { isAuthenticated, hasRole } from '../middleware/auth.js';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', isAuthenticated, hasRole(['admin', 'organizer']), createEvent);
router.put('/:id', isAuthenticated, hasRole(['admin', 'organizer']), updateEvent);
router.delete('/:id', isAuthenticated, hasRole('admin'), deleteEvent);

export default router;
