# Project Summary
The Private Garage Rental App is a web application designed to connect garage owners with individuals seeking secure parking solutions for short-term use. The platform allows users to list their garages with detailed descriptions and photos while enabling others to search and book available spaces based on location and price. The recent development phase aims to enhance user experience by integrating a frontend built with React, focusing on user-friendly login and garage listing pages.

# Project Module Description
- **Authentication Module**: Facilitates user registration and login via email/password or Google credentials.
- **Garage Listing Module**: Allows users to upload photos and details, including dimensions and access types of their garages.
- **Search & Booking Module**: Users can search for garages by location, price, and access type, and make bookings for daily use.
- **User Dashboard Module**: Users can manage their bookings and update their profiles.
- **Frontend Module**: Developed using React, includes pages for user login and listing available garages.

# Directory Tree
```
private_garage_rental_app_class_diagram.mermaid   # Class diagram for the application
private_garage_rental_app_prd.md                   # Product Requirement Document outlining features and specifications
private_garage_rental_app_sequence_diagram.mermaid  # Sequence diagram illustrating interactions in the app
private_garage_rental_app_system_design.md          # System design document detailing implementation approach
src/index.js                                        # Entry point for the application
src/models/booking.js                                # Model for booking functionality
src/models/garage.js                                 # Model for garage listings
src/models/user.js                                   # Model for user management
src/routes/auth.js                                   # Routes for user authentication
src/routes/booking.js                                # Routes for booking functionalities
src/routes/garage.js                                 # Routes for garage management
src/pages/Login.jsx                                  # React component for user login
src/pages/GarageListing.jsx                          # React component for listing garages
src/App.jsx                                         # Main React application component
package.json                                        # Configuration file for project dependencies
```

# File Description Inventory
- **private_garage_rental_app_class_diagram.mermaid**: Contains the class structure and relationships within the application.
- **private_garage_rental_app_prd.md**: Documents product goals, user stories, competitive analysis, and technical specifications.
- **private_garage_rental_app_sequence_diagram.mermaid**: Illustrates the flow of operations and interactions between components.
- **private_garage_rental_app_system_design.md**: Details the architecture and implementation strategy of the application.
- **src/index.js**: Main file to initialize the server and application.
- **src/models/booking.js**: Defines the booking data structure and functionality.
- **src/models/garage.js**: Defines the garage data structure and functionality.
- **src/models/user.js**: Defines the user data structure and functionality.
- **src/routes/auth.js**: Manages user authentication routes.
- **src/routes/booking.js**: Manages routes related to booking operations.
- **src/routes/garage.js**: Manages routes for garage listings.
- **src/pages/Login.jsx**: Contains the login interface for users.
- **src/pages/GarageListing.jsx**: Displays a list of available garages for users.
- **src/App.jsx**: Main component that integrates all pages of the React application.
- **package.json**: Lists project dependencies and scripts.

# Technology Stack
- **Backend**: Node.js, Express
- **Frontend**: React
- **Database**: PostgreSQL
- **Authentication**: Firebase Admin SDK
- **Session Management**: JWT
- **Environment Configuration**: dotenv
- **Password Management**: bcryptjs

# Usage
1. Ensure `package.json` is present and properly configured.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run linting checks:
   ```bash
   npm run lint
   ```
4. Start the application (command not specified for security reasons).
