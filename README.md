# Event Management API

This project provides a robust backend API for an event management system, built with Node.js, Express.js, and Sequelize (for PostgreSQL). It includes full authentication, role-based access control (RBAC), security middleware, and a clear, extensible structure.

## Table of Contents

- [Features](#features)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication & JWT Lifetime](#authentication--jwt-lifetime)
- [Seeding Dummy Data](#seeding-dummy-data)
- [Extending CRUD for Other Models](#extending-crud-for-other-models)

## Features

-   **Full Authentication**: Email/password signup & login with bcrypt hashing.
-   **Role-Based Access Control (RBAC)**: `admin`, `organizer`, `attendee` roles with middleware for protection.
-   **Security**: Helmet, CORS (configurable), and Rate Limiting middleware.
-   **CRUD Operations**: Full CRUD for `User`, `Event`, and `Venue` models.
-   **Database**: PostgreSQL with Sequelize ORM, including model associations.
-   **Dummy Data**: Script to seed the database with test users and sample events.
-   **Error Handling**: Centralized error handling.
-   **Modular Structure**: Organized controllers, routes, and middleware.

## Database Schema

The API interacts with the following database tables:

-   `User`: Manages user accounts, roles, and authentication details.
-   `Venue`: Stores information about event locations.
-   `Category`: Categorizes events.
-   `Event`: Main event details, linked to organizers, venues, and categories.
-   `TicketType`: Defines different ticket options for an event.
-   `Speaker`: Information about event speakers.
-   `EventSpeaker`: Junction table for events and speakers (many-to-many).
-   `Registration`: Records user registrations for events.
-   `Payment`: Tracks payment transactions for registrations.

_Note: This project was generated with a focus on core entities (`User`, `Event`, `Venue`) due to the size of the provided schema. While all models are defined, dedicated CRUD controllers and routes are provided for `User`, `Event`, and `Venue`. A generic pattern is provided to extend CRUD for `Registration`, `Category`, `TicketType`, `Speaker`, `EventSpeaker`, and `Payment`.

## Setup Instructions

1.  **Clone the repository**:
    bash
    git clone <repository_url>
    cd event-management-api
    

2.  **Install dependencies**:
    bash
    npm install
    

3.  **Configure environment variables**: Create a `.env` file in the root directory based on `.env.example`.

4.  **Run migrations / Sync Database**: (See [Database Setup](#database-setup) section).

5.  **Seed Dummy Data**: (Optional, but recommended for testing. See [Seeding Dummy Data](#seeding-dummy-data) section).

6.  **Start the server**:
    bash
    npm start
    # or for development with hot-reloading:
    npm run dev
    
    The API will run on the port specified in your `.env` file (default: `5000`).

## Environment Variables

Create a `.env` file in the root of your project based on the `.env.example` provided:

-   `NODE_ENV`: `development`, `production`, `test` (e.g., `development`)
-   `PORT`: Port for the server to listen on (e.g., `5000`)
-   `SQL_URI`: Your PostgreSQL connection string (e.g., `postgres://user:password@host:5432/database_name`)
-   `JWT_SECRET`: Secret key for signing access tokens.
-   `JWT_EXPIRES_IN`: Expiration time for access tokens (e.g., `15m`, `1h`).
-   `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens.
-   `JWT_REFRESH_EXPIRES_IN`: Expiration time for refresh tokens (e.g., `7d`, `30d`).
-   `BCRYPT_SALT_ROUNDS`: Number of salt rounds for bcrypt password hashing (e.g., `12`).
-   `RATE_LIMIT_WINDOW_MS`: Time window for rate limiting in milliseconds (e.g., `60000` for 1 minute).
-   `RATE_LIMIT_MAX`: Max requests per `RATE_LIMIT_WINDOW_MS` (e.g., `100`).
-   `CORS_ORIGIN`: Allowed origin for CORS (e.g., `http://localhost:3000`). Use `*` to allow all origins (NOT recommended for production).

## Database Setup

This project uses **PostgreSQL** with **Sequelize**. The `config/db.js` file handles the connection and model synchronization.

In a production environment, it is highly recommended to use **database migrations** instead of `sequelize.sync()`. For development and initial setup, `sequelize.sync({ alter: true })` is used to create/update tables based on model definitions. 

**To set up your database:**

1.  Ensure PostgreSQL is running and accessible.
2.  Create a database (e.g., `event_management_db`).
3.  Update the `SQL_URI` in your `.env` file with the correct connection string.
4.  The `server.js` will automatically attempt to connect and sync models on startup.

## API Endpoints

All API routes are prefixed with `/api`.

### Authentication Routes (`/api/auth`)

-   `POST /api/auth/register`: Register a new user. (Requires `username`, `email`, `password`, `firstName`, `lastName`, `role` (defaults to 'attendee').)
-   `POST /api/auth/login`: Log in a user and receive access & refresh tokens. (Requires `email`, `password`.)
-   `POST /api/auth/refresh-token`: Get a new access token using a refresh token.
-   `POST /api/auth/logout`: Invalidate refresh token (requires refresh token in cookies).

### User Routes (`/api/users`)

-   `GET /api/users`: Get all users. (Admin only)
-   `GET /api/users/:id`: Get a user by ID. (Admin only, or user themselves)
-   `PUT /api/users/:id`: Update a user. (Admin only, or user themselves)
-   `DELETE /api/users/:id`: Delete a user. (Admin only)

### Event Routes (`/api/events`)

-   `POST /api/events`: Create a new event. (Requires authentication, `organizer` or `admin` role)
-   `GET /api/events`: Get all events.
-   `GET /api/events/:id`: Get an event by ID.
-   `PUT /api/events/:id`: Update an event. (Requires authentication, `organizer` or `admin` role, and ownership)
-   `DELETE /api/events/:id`: Delete an event. (Requires authentication, `admin` role)

### Venue Routes (`/api/venues`)

-   `POST /api/venues`: Create a new venue. (Requires authentication, `organizer` or `admin` role)
-   `GET /api/venues`: Get all venues.
-   `GET /api/venues/:id`: Get a venue by ID.
-   `PUT /api/venues/:id`: Update a venue. (Requires authentication, `admin` role)
-   `DELETE /api/venues/:id`: Delete a venue. (Requires authentication, `admin` role)

## Authentication & JWT Lifetime

This API uses JWTs for authentication. Upon successful login, two tokens are issued:

1.  **Access Token**: A short-lived token (default: `15m`) used to access protected resources. It's sent in the `Authorization` header as a Bearer token.
2.  **Refresh Token**: A long-lived token (default: `7d`) used to obtain new access tokens once the current one expires. It's stored as an HTTP-only cookie.

When an access token expires, the client should use the refresh token (by making a `POST /api/auth/refresh-token` request) to get a new access token without requiring the user to re-authenticate with their credentials.

## Seeding Dummy Data

The `dummyData.js` script populates your database with essential test data, including:

-   An `admin` user.
-   An `organizer` user.
-   An `attendee` user.
-   Sample `Venue` data.
-   Sample `Category` data.
-   Sample `Event` data linked to the users, venues, and categories.
-   Sample `TicketType` data for events.
-   Sample `Registration` data for events and users.

**To run the seeder:**

1.  Ensure your `.env` is configured correctly and the database is accessible.
2.  Run the seed script:
    bash
    npm run seed
    
    You will see console logs indicating the success or failure of the seeding process.

## Extending CRUD for Other Models

For `Registration`, `Category`, `TicketType`, `Speaker`, `EventSpeaker`, and `Payment` models, a generic CRUD pattern is provided in `controllers/genericController.js` and `routes/genericRoutes.js`.

**To add full CRUD for a model (e.g., `Category`):**

1.  **Define the Model**: Ensure your model (`models/Category.js`) is correctly defined and associated in `config/db.js`.

2.  **Use `genericController.js`**: You can import `Models` from `../config/db.js` in your custom controller or directly use `genericController`.

    javascript
    // Example: routes/categoryRoutes.js
    import { Router } from 'express';
    import { isAuthenticated, hasRole } from '../middleware/auth.js';
    import * as genericController from '../controllers/genericController.js';
    import db from '../config/db.js'; // To access the Category model

    const router = Router();
    const Category = db.Category; // Get the model instance

    // Create a new category (Admin/Organizer only)
    router.post('/', isAuthenticated, hasRole(['admin', 'organizer']), (req, res, next) => genericController.createOne(Category, req, res, next));

    // Get all categories (Public)
    router.get('/', (req, res, next) => genericController.getAll(Category, req, res, next));

    // Get category by ID (Public)
    router.get('/:id', (req, res, next) => genericController.getOne(Category, req, res, next));

    // Update a category (Admin/Organizer only)
    router.put('/:id', isAuthenticated, hasRole(['admin', 'organizer']), (req, res, next) => genericController.updateOne(Category, req, res, next));

    // Delete a category (Admin only)
    router.delete('/:id', isAuthenticated, hasRole('admin'), (req, res, next) => genericController.deleteOne(Category, req, res, next));

    export default router;
    

3.  **Mount the Routes**: Add the new route file to `routes/index.js`:

    javascript
    // Example: routes/index.js
    import categoryRoutes from './categoryRoutes.js';
    // ... other imports ...

    router.use('/categories', categoryRoutes);
    

This pattern allows you to quickly set up standard CRUD operations for any model, and then customize or add more complex logic as needed in dedicated controllers.