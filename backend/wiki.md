# Project Summary
The Garage Rental Web Application is a full-stack solution that allows users to rent private garages. Built with React for the frontend and Express.js for the backend, it features user authentication, garage listings, booking management, and a credit system. The application supports Google OAuth for seamless user login and integrates with a PostgreSQL database to manage data effectively.

# Project Module Description
- **Authentication**: User registration and login, including Google OAuth.
- **User Management**: Profile management and password updates.
- **Garage Management**: CRUD operations for garage listings, including image uploads and availability checks.
- **Booking System**: Users can create, view, and cancel bookings for garages.
- **Rating System**: Users can rate and review garages they have rented.
- **Credit System**: Users can manage credits for booking discounts and view transaction history.

# Directory Tree
```
backend/
├── README.md                # Project overview and setup instructions
├── index.js                 # Entry point for the application
├── package.json             # Project metadata and dependencies
├── .env                     # Environment variables
├── .gitignore               # Files and directories to ignore in version control
└── src/
    ├── config/
    │   └── db.js           # Database connection configuration
    ├── controllers/
    │   ├── authController.js # Handles authentication logic
    │   ├── userController.js # Manages user profile operations
    │   ├── garageController.js # Manages garage listings
    │   ├── bookingController.js # Manages bookings
    │   ├── ratingController.js # Manages ratings
    │   └── creditController.js # Manages credits
    ├── middlewares/
    │   └── verifyToken.js   # Middleware for token verification
    ├── models/
    │   ├── user.js          # User model
    │   ├── garage.js        # Garage model
    │   ├── booking.js       # Booking model
    │   ├── rating.js        # Rating model
    │   └── credit.js        # Credit model
    ├── routes/
    │   ├── authRoutes.js    # Routes for authentication
    │   ├── userRoutes.js    # Routes for user management
    │   ├── garageRoutes.js   # Routes for garage management
    │   ├── bookingRoutes.js  # Routes for booking management
    │   ├── ratingRoutes.js   # Routes for rating management
    │   └── creditRoutes.js   # Routes for credit management
    └── server.js            # Main server configuration and routes
```

# File Description Inventory
- **README.md**: Provides an overview of the project, setup instructions, and usage.
- **index.js**: Entry point that starts the server.
- **package.json**: Contains project dependencies, scripts, and metadata.
- **.env**: Holds environment variables for database and server configuration.
- **.gitignore**: Specifies files to be ignored by Git.
- **src/config/db.js**: Configures the PostgreSQL database connection.
- **src/controllers/**: Contains the logic for handling requests and responses for different features.
- **src/middlewares/verifyToken.js**: Middleware for verifying JWT tokens.
- **src/models/**: Defines database models for users, garages, bookings, ratings, and credits.
- **src/routes/**: Defines API routes for handling requests related to authentication, user management, garage management, bookings, ratings, and credits.
- **src/server.js**: Sets up the Express server and middleware.

# Technology Stack
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, Google OAuth
- **Libraries**: bcryptjs, cors, dotenv, google-auth-library, jsonwebtoken, pg, multer

# Usage
1. Install dependencies: Run `npm install` in the backend directory.
2. Set up the database: Configure the PostgreSQL database as specified in the `.env` file.
3. Start the server: Run `npm start` or `node index.js` in the backend directory.
