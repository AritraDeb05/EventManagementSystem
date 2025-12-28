import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from './config/db.js';

const { User, Venue, Category, Event, TicketType, Registration, Speaker, EventSpeaker, Payment } = db;

const seedData = async () => {
  try {
    console.log('Starting dummy data seeding...');

    // Sync all models (clears and recreates tables)
    await db.sequelize.sync({ force: true });
    console.log('Database synced (all tables dropped and recreated).');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

    // 1. Create Users
    const adminPasswordHash = await bcrypt.hash('adminpassword', saltRounds);
    const organizerPasswordHash = await bcrypt.hash('organizerpassword', saltRounds);
    const attendeePasswordHash = await bcrypt.hash('attendeepassword', saltRounds);

    const adminUser = await User.create({
      username: 'adminuser',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });
    console.log('Admin user created.');

    const organizerUser = await User.create({
      username: 'eventorganizer',
      email: 'organizer@example.com',
      passwordHash: organizerPasswordHash,
      firstName: 'Event',
      lastName: 'Organizer',
      role: 'organizer',
    });
    console.log('Organizer user created.');

    const attendeeUser = await User.create({
      username: 'eventattendee',
      email: 'attendee@example.com',
      passwordHash: attendeePasswordHash,
      firstName: 'Event',
      lastName: 'Attendee',
      role: 'attendee',
    });
    console.log('Attendee user created.');

    // 2. Create Venues
    const venue1 = await Venue.create({
      name: 'Grand Convention Center',
      address: '123 Main St',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      capacity: 5000,
      contactInfo: 'venue@example.com',
    });
    console.log('Venue 1 created.');

    const venue2 = await Venue.create({
      name: 'Tech Expo Hall',
      address: '456 Innovation Ave',
      city: 'Techville',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      capacity: 2000,
      contactInfo: 'techvenue@example.com',
    });
    console.log('Venue 2 created.');

    // 3. Create Categories
    const categoryTech = await Category.create({
      name: 'Technology',
      description: 'Events related to software, hardware, AI, etc.',
    });
    console.log('Category Technology created.');

    const categoryMusic = await Category.create({
      name: 'Music',
      description: 'Concerts, festivals, and music-related events.',
    });
    console.log('Category Music created.');

    // 4. Create Events
    const event1 = await Event.create({
      organizerId: organizerUser.id,
      venueId: venue1.id,
      categoryId: categoryTech.id,
      title: 'Global Tech Conference 2024',
      description: 'The premier tech event of the year, featuring leading innovators.',
      startDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
      endDate: new Date(Date.now() + 86400000 * 32), // 32 days from now
      status: 'scheduled',
      isPublished: true,
      maxAttendees: 4000,
      imageUrl: 'http://example.com/tech-conf.jpg',
    });
    console.log('Event 1 created.');

    const event2 = await Event.create({
      organizerId: organizerUser.id,
      venueId: venue2.id,
      categoryId: categoryMusic.id,
      title: 'Summer Music Festival',
      description: 'A weekend of live music from various artists.',
      startDate: new Date(Date.now() + 86400000 * 60), // 60 days from now
      endDate: new Date(Date.now() + 86400000 * 62), // 62 days from now
      status: 'scheduled',
      isPublished: true,
      maxAttendees: 1500,
      imageUrl: 'http://example.com/music-fest.jpg',
    });
    console.log('Event 2 created.');

    // 5. Create TicketTypes for events
    const ticketType1_event1 = await TicketType.create({
      eventId: event1.id,
      name: 'Standard Pass',
      description: 'Access to all conference sessions.',
      price: 299.99,
      quantityAvailable: 1000,
      saleStartDate: new Date(Date.now() + 86400000 * 15),
      saleEndDate: new Date(Date.now() + 86400000 * 29),
    });
    console.log('TicketType 1 for Event 1 created.');

    const ticketType2_event1 = await TicketType.create({
      eventId: event1.id,
      name: 'VIP Pass',
      description: 'Includes premium access and workshops.',
      price: 499.99,
      quantityAvailable: 200,
      saleStartDate: new Date(Date.now() + 86400000 * 15),
      saleEndDate: new Date(Date.now() + 86400000 * 29),
    });
    console.log('TicketType 2 for Event 1 created.');

    const ticketType1_event2 = await TicketType.create({
      eventId: event2.id,
      name: 'General Admission',
      description: 'Entry to the music festival for the weekend.',
      price: 75.00,
      quantityAvailable: 800,
      saleStartDate: new Date(Date.now() + 86400000 * 45),
      saleEndDate: new Date(Date.now() + 86400000 * 59),
    });
    console.log('TicketType 1 for Event 2 created.');

    // 6. Create Registrations
    const registration1 = await Registration.create({
      userId: attendeeUser.id,
      eventId: event1.id,
      ticketTypeId: ticketType1_event1.id,
      quantity: 1,
      totalAmount: 299.99,
      status: 'confirmed',
    });
    console.log('Registration 1 created.');

    const registration2 = await Registration.create({
      userId: attendeeUser.id,
      eventId: event2.id,
      ticketTypeId: ticketType1_event2.id,
      quantity: 2,
      totalAmount: 150.00,
      status: 'pending',
    });
    console.log('Registration 2 created.');

    // 7. Create Speakers (Minimal for demonstration, no direct CRUD generated for this in app)
    const speaker1 = await Speaker.create({
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'AI expert and author.',
      email: 'jane.doe@example.com',
      photoUrl: 'http://example.com/jane.jpg',
    });
    console.log('Speaker 1 created.');

    const speaker2 = await Speaker.create({
      firstName: 'John',
      lastName: 'Smith',
      bio: 'Cloud computing specialist.',
      email: 'john.smith@example.com',
      photoUrl: 'http://example.com/john.jpg',
    });
    console.log('Speaker 2 created.');

    // 8. Create EventSpeaker associations
    await EventSpeaker.create({
      eventId: event1.id,
      speakerId: speaker1.id,
      role: 'Keynote Speaker',
    });

    await EventSpeaker.create({
      eventId: event1.id,
      speakerId: speaker2.id,
      role: 'Panelist',
    });
    console.log('EventSpeaker associations created.');

    // 9. Create Payments
    await Payment.create({
      registrationId: registration1.id,
      amount: registration1.totalAmount,
      currency: 'USD',
      status: 'completed',
      transactionId: 'TXN' + Date.now(),
      paymentMethod: 'Credit Card',
    });
    console.log('Payment 1 created.');

    console.log('Dummy data seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding dummy data:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
    console.log('Database connection closed.');
  }
};

seedData();
