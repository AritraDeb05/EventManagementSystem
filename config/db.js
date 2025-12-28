import { Sequelize, DataTypes } from 'sequelize';
import 'dotenv/config';

// Database configuration
const sequelize = new Sequelize(process.env.SQL_URI, {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries in console
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = (await import('../models/User.js')).default(sequelize);
db.Venue = (await import('../models/Venue.js')).default(sequelize);
db.Category = (await import('../models/Category.js')).default(sequelize);
db.Event = (await import('../models/Event.js')).default(sequelize);
db.TicketType = (await import('../models/TicketType.js')).default(sequelize);
db.Speaker = (await import('../models/Speaker.js')).default(sequelize);
db.EventSpeaker = (await import('../models/EventSpeaker.js')).default(sequelize);
db.Registration = (await import('../models/Registration.js')).default(sequelize);
db.Payment = (await import('../models/Payment.js')).default(sequelize);

// Define Associations
// User Associations
db.User.hasMany(db.Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
db.User.hasMany(db.Registration, { foreignKey: 'userId', as: 'registrations' });

// Venue Associations
db.Venue.hasMany(db.Event, { foreignKey: 'venueId', as: 'events' });

// Category Associations
db.Category.hasMany(db.Event, { foreignKey: 'categoryId', as: 'events' });

// Event Associations
db.Event.belongsTo(db.User, { foreignKey: 'organizerId', as: 'organizer' });
db.Event.belongsTo(db.Venue, { foreignKey: 'venueId', as: 'venue' });
db.Event.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });
db.Event.hasMany(db.TicketType, { foreignKey: 'eventId', as: 'ticketTypes' });
db.Event.hasMany(db.Registration, { foreignKey: 'eventId', as: 'registrations' });
db.Event.belongsToMany(db.Speaker, { through: db.EventSpeaker, foreignKey: 'eventId', as: 'speakers' });

// TicketType Associations
db.TicketType.belongsTo(db.Event, { foreignKey: 'eventId', as: 'event' });
db.TicketType.hasMany(db.Registration, { foreignKey: 'ticketTypeId', as: 'registrations' });

// Speaker Associations
db.Speaker.belongsToMany(db.Event, { through: db.EventSpeaker, foreignKey: 'speakerId', as: 'events' });

// EventSpeaker Associations (Junction Table)
db.EventSpeaker.belongsTo(db.Event, { foreignKey: 'eventId' });
db.EventSpeaker.belongsTo(db.Speaker, { foreignKey: 'speakerId' });

// Registration Associations
db.Registration.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.Registration.belongsTo(db.Event, { foreignKey: 'eventId', as: 'event' });
db.Registration.belongsTo(db.TicketType, { foreignKey: 'ticketTypeId', as: 'ticketType' });
db.Registration.hasOne(db.Payment, { foreignKey: 'registrationId', as: 'payment' });

// Payment Associations
db.Payment.belongsTo(db.Registration, { foreignKey: 'registrationId', as: 'registration' });

export default db;
