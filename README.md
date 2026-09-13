MINI SERVICE TICKET MANAGEMENT SYSTEM

Project Overview

The Mini Service Ticket Management System is a web-based application developed to simplify and organize the management of customer service requests.

The system provides a centralized platform where service tickets can be created, viewed, searched, filtered, updated, and managed efficiently. It is designed with a clean and user-friendly interface to make ticket management simple and effective.

Technologies Used

Frontend:
- React.js
- Vite
- JavaScript
- HTML
- CSS

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose
- MongoDB Atlas

Development Tools:
- Visual Studio Code
- Git
- GitHub


Key Features

1. Ticket Dashboard
   Provides an overview of all service tickets and displays important ticket information in an organized manner.

2. Create Ticket
   Allows users to create a new service ticket by entering customer details, ticket title, description, category, and priority.

3. View Ticket Details
   Users can open a ticket to view its complete details.

4. Update Ticket
   Existing ticket information can be updated whenever required.

5. Ticket Status Management
   Tickets can be moved through the following statuses:
   - Open
   - In Progress
   - Resolved
   - Closed

6. Priority Management
   Tickets can be categorized according to their priority:
   - Low
   - Medium
   - High

7. Search
   Users can search for tickets using the ticket title or customer name.

8. Filtering
   Tickets can be filtered based on their status and priority.

9. Ticket Dates
   The system displays the ticket creation date and last updated date.

10. Delete Ticket
    Users can remove tickets when they are no longer required.

11. Validation and Error Handling
    The system validates required information and provides suitable error responses for invalid requests.

12. Support Information
    The application includes Need Help and Support Team sections to provide assistance information.


Ticket Information

Each service ticket contains:

- Ticket ID
- Customer Name
- Title
- Description
- Category
- Priority
- Status
- Created Date
- Last Updated Date


REST API

GET /api/tickets
Retrieves all service tickets.

GET /api/tickets/:id
Retrieves a specific ticket using its ID.

POST /api/tickets
Creates a new service ticket.

PUT /api/tickets/:id
Updates an existing ticket.

DELETE /api/tickets/:id
Deletes a service ticket.


Project Structure

mini ticket system
|
|-- backend
|   |-- models
|   |   |-- Ticket.js
|   |-- routes
|   |   |-- ticketRoutes.js
|   |-- server.js
|   |-- .env
|   |-- package.json
|
|-- client
|   |-- src
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- main.jsx
|   |-- package.json
|
|-- README.txt


Database

MongoDB Atlas is used to store and manage service ticket information.

Mongoose is used in the backend to define the ticket structure and communicate with the MongoDB database.


Installation and Setup

1. Open the project folder in Visual Studio Code.

2. Install backend dependencies:

npm install

3. Configure the MongoDB connection in the backend .env file:

MONGO_URI=your_mongodb_connection_string

4. Start the backend server:

node server.js

The backend runs on:

http://localhost:5000

5. Open another terminal and move to the client folder:

cd client

6. Install frontend dependencies:

npm install

7. Start the frontend application:

npm run dev

The frontend normally runs on:

http://localhost:5173


Validation and Error Handling

The application validates required ticket information before creating or updating tickets.

The backend handles:

- Missing required fields
- Invalid ticket IDs
- Tickets that do not exist
- Invalid priority values
- Invalid status values
- Database errors

Appropriate HTTP status codes are returned based on the result of each request.


User Interface

The application provides a clean and professional service ticket management interface.

The interface includes:

- Service Ticket System navigation
- Dashboard
- Ticket statistics
- Search and filter options
- Ticket cards
- Ticket details
- Create Ticket form
- Need Help section
- Support Team information


Future Enhancements

The system can be further improved by adding:

- User authentication
- Role-based access
- Ticket assignment
- Email notifications
- Pagination
- Advanced reporting
- Automated testing
- Docker deployment


Conclusion

The Mini Service Ticket Management System provides a simple, organized, and efficient way to manage customer service requests.

By combining a React frontend, Node.js and Express backend, and MongoDB database, the system provides a complete solution for creating and managing service tickets through a modern web application.

