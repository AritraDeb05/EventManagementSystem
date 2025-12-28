import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import eventRoutes from './eventRoutes.js';
import venueRoutes from './venueRoutes.js';
import { createGenericRoutes } from './genericRoutes.js';

const router = Router();

// Main API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/venues', venueRoutes);

// Generic routes for other models (demonstrates how to extend)
// Example for Category
router.use('/categories', createGenericRoutes('Category', {
  createRoles: ['admin', 'organizer'],
  updateRoles: ['admin', 'organizer'],
  deleteRoles: ['admin'],
  publicRead: true,
}));

// Example for Registration
router.use('/registrations', createGenericRoutes('Registration', {
  createRoles: ['admin', 'attendee'], // Attendee can create their own registration
  updateRoles: ['admin', 'attendee'], // Admin can update any, attendee their own
  deleteRoles: ['admin', 'attendee'], // Admin can delete any, attendee their own
  publicRead: false, // Registrations are not publicly readable
  ownerField: 'userId', // Use userId for specific ownership checks
}));

// Placeholder for other models - follow the pattern above to define routes for:
// TicketType, Speaker, EventSpeaker, Payment
// Example for TicketType (can be created/managed by organizers/admins for their events)
router.use('/ticket-types', createGenericRoutes('TicketType', {
  createRoles: ['admin', 'organizer'],
  updateRoles: ['admin', 'organizer'],
  deleteRoles: ['admin', 'organizer'],
  publicRead: true, // Might be public to view available ticket types
  // ownerField: 'eventId' // If you want to tie ticket type ownership to event owner
}));

// Example for Speaker (created/managed by organizers/admins)
router.use('/speakers', createGenericRoutes('Speaker', {
  createRoles: ['admin', 'organizer'],
  updateRoles: ['admin', 'organizer'],
  deleteRoles: ['admin', 'organizer'],
  publicRead: true,
}));

// Example for Payment (registrations are managed by admins/attendees, payments typically handled by system/admin)
router.use('/payments', createGenericRoutes('Payment', {
  createRoles: ['admin', 'attendee'], // Attendee makes a payment (via system), admin manages
  updateRoles: ['admin'], // Only admin can update payment status etc.
  deleteRoles: ['admin'], // Only admin can delete payments
  publicRead: false, // Payments are not publicly readable
  ownerField: 'registrationId', // Link to registration owner to potentially view their own payment
}));

// Note: EventSpeaker is a junction table, its CRUD might be better managed through
// nested routes or specific methods within Event/Speaker controllers rather than generic CRUD.
// E.g., POST /api/events/:eventId/speakers to add a speaker to an event.

export default router;
