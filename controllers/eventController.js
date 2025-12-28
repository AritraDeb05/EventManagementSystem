import db from '../config/db.js';

const Event = db.Event;
const User = db.User;
const Venue = db.Venue;
const Category = db.Category;

// Create a new event
export const createEvent = async (req, res, next) => {
  try {
    const { organizerId, venueId, categoryId, title, description, startDate, endDate, status, isPublished, maxAttendees, imageUrl } = req.body;

    // Ensure organizerId matches authenticated user's ID if not admin
    if (req.user.role !== 'admin' && req.user.id !== organizerId) {
      return res.status(403).json({ message: 'Forbidden: You can only create events for your own organizer ID.' });
    }

    // Basic validation for required fields
    if (!organizerId || !venueId || !categoryId || !title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide all required event details.' });
    }

    // Check if associated records exist
    const organizer = await User.findByPk(organizerId);
    const venue = await Venue.findByPk(venueId);
    const category = await Category.findByPk(categoryId);

    if (!organizer || !venue || !category) {
      return res.status(400).json({ message: 'Organizer, venue, or category not found.' });
    }

    const newEvent = await Event.create({
      organizerId,
      venueId,
      categoryId,
      title,
      description,
      startDate,
      endDate,
      status: status || 'scheduled',
      isPublished: isPublished !== undefined ? isPublished : false,
      maxAttendees,
      imageUrl,
    });

    res.status(201).json({ message: 'Event created successfully.', event: newEvent });
  } catch (error) {
    next(error);
  }
};

// Get all events with associations
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'username', 'email', 'firstName', 'lastName'] },
        { model: Venue, as: 'venue' },
        { model: Category, as: 'category' },
      ],
    });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// Get event by ID with associations
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'username', 'email', 'firstName', 'lastName'] },
        { model: Venue, as: 'venue' },
        { model: Category, as: 'category' },
        { model: db.TicketType, as: 'ticketTypes' },
        { model: db.Speaker, as: 'speakers', through: { attributes: ['role'] } }, // Include speakers through EventSpeaker
      ],
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Update an event
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Authorization: Only admin or the event organizer can update
    if (req.user.role !== 'admin' && req.user.id !== event.organizerId) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to update this event.' });
    }

    // Update event fields
    await event.update(updateData);

    res.status(200).json({ message: 'Event updated successfully.', event });
  } catch (error) {
    next(error);
  }
};

// Delete an event (Admin only for now, can be extended to organizer with checks)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Authorization: Only admin can delete events for now
    // Could be extended: req.user.role === 'admin' || (req.user.role === 'organizer' && req.user.id === event.organizerId)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only administrators can delete events.' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
