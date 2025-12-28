import db from '../config/db.js';

const Venue = db.Venue;

// Create a new venue
export const createVenue = async (req, res, next) => {
  try {
    const newVenue = await Venue.create(req.body);
    res.status(201).json({ message: 'Venue created successfully.', venue: newVenue });
  } catch (error) {
    next(error);
  }
};

// Get all venues
export const getAllVenues = async (req, res, next) => {
  try {
    const venues = await Venue.findAll();
    res.status(200).json(venues);
  } catch (error) {
    next(error);
  }
};

// Get venue by ID
export const getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found.' });
    }
    res.status(200).json(venue);
  } catch (error) {
    next(error);
  }
};

// Update a venue
export const updateVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Venue.update(req.body, {
      where: { id },
      returning: true, // Return the updated object
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: 'Venue not found.' });
    }

    res.status(200).json({ message: 'Venue updated successfully.', venue: updated[1][0] });
  } catch (error) {
    next(error);
  }
};

// Delete a venue
export const deleteVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Venue.destroy({
      where: { id },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Venue not found.' });
    }

    res.status(200).json({ message: 'Venue deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
