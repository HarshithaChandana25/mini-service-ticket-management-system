# Mini Service Ticket Management System

A full-stack web application for creating, managing, tracking, and resolving customer service tickets through a centralized ticket management system.

The system uses a React frontend, a Node.js and Express.js REST API, and MongoDB Atlas for persistent data storage.

---

## Project Overview

The Mini Service Ticket Management System helps support teams efficiently manage customer service requests.

Users can create tickets, view ticket details, search and filter tickets, update ticket status and priority, add comments, and track ticket activity.

---

## Key Features

- Create, view, update, and delete service tickets
- Search tickets by title or customer name
- Filter tickets by status, priority, and customer
- View complete ticket details
- Update ticket status
- Add comments to tickets
- Track ticket activity
- Form validation and API error handling
- Responsive and professional user interface

### Ticket Status

- Open
- In Progress
- Resolved
- Closed

### Priority

- Low
- Medium
- High

### Ticket Information

Each ticket contains:

- Customer Name
- Title
- Description
- Category
- Priority
- Status
- Created Date
- Last Updated Date
- Comments
- Activity History

---

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- REST API
- CORS
- dotenv

### Database
- MongoDB
- Mongoose
- MongoDB Atlas

### Tools
- Visual Studio Code
- Git
- GitHub
- Google Chrome

---

## Project Structure

```text
mini ticket system
│
├── backend
│   ├── models
│   │   └── Ticket.js
│   ├── routes
│   │   └── ticketRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── client
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> **Note:** The actual `.env` file and `node_modules` folders are not included in the GitHub repository or submission ZIP. The `.env` file contains sensitive database connection information.

---

# Getting Started

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account
- Git
- Visual Studio Code

---

## 1. Clone the Repository

Clone the GitHub repository:

```bash
git clone [GitHub Repository](https://github.com/HarshithaChandana25/mini-service-ticket-management-system).git
```

Then open the project folder:

```bash
cd mini-service-ticket-management-system
```

---

# Backend Setup

## 2. Install Backend Dependencies

The `backend` folder is already included in the project.

Open a terminal and navigate to it:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

---

## 3. Configure MongoDB

The project uses MongoDB Atlas.

Inside the existing `backend` folder, create a file named:

```text
.env
```

Use the provided `.env.example` file as the reference.

Add:

```env
MONGO_URI=your_mongodb_connection_string
```

Replace the value with your MongoDB Atlas connection string.

### Security

Do not upload the actual `.env` file to GitHub.

The repository contains `.env.example` only as a safe configuration template. The actual `.env` file is excluded through `.gitignore`.

---

## 4. Start the Backend

From the `backend` folder, run:

```bash
node server.js
```

The backend runs on:

```text
[http://localhost:5000](http://localhost:5000)
```

A successful connection should display messages similar to:

```text
MongoDB connected successfully
Server running on [http://localhost:5000](http://localhost:5000)
```

---

# Frontend Setup

## 5. Install Frontend Dependencies

Open a new terminal and navigate to the existing `client` folder:

```bash
cd client
```

Install the required dependencies:

```bash
npm install
```

---

## 6. Start the Frontend

From the `client` folder, run:

```bash
npm run dev
```

Vite will display the local development URL, normally:

```text
[http://localhost:5173](http://localhost:5173)
```

Open the displayed URL in Google Chrome.

> **Important:** Start the backend before using the frontend so that the application can communicate with the REST API and MongoDB.

---

# REST API

Base URL:

```text
[http://localhost:5000/api/tickets](http://localhost:5000/api/tickets)
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tickets` | Get all tickets |
| GET | `/api/tickets/:id` | Get a specific ticket |
| POST | `/api/tickets` | Create a new ticket |
| PUT | `/api/tickets/:id` | Update a ticket |
| DELETE | `/api/tickets/:id` | Delete a ticket |
| POST | `/api/tickets/:id/comments` | Add a comment |

---

## Search and Filtering

### Filter by Status

```text
GET /api/tickets?status=Open
```

### Filter by Priority

```text
GET /api/tickets?priority=High
```

### Search by Title or Customer

```text
GET /api/tickets?search=login
```

### Filter by Customer

```text
GET /api/tickets?customer=Rahul
```

---

# Ticket Creation

Example request:

```json
{
  "customerName": "Rahul Sharma",
  "title": "Unable to login",
  "description": "Customer is unable to access the account.",
  "category": "Technical",
  "priority": "High"
}
```

The ticket status defaults to `Open`.

Created and updated timestamps are automatically maintained using Mongoose timestamps.

---

# Database

The application uses:

**MongoDB Atlas**

Database:

```text
mini_ticket_system
```

Mongoose is used for schema definition and database operations.

The database stores:

- Customer information
- Ticket details
- Category
- Priority
- Status
- Comments
- Activity history
- Created timestamp
- Updated timestamp

---

# Validation and Error Handling

The backend validates requests before performing database operations.

The system handles:

- Missing required fields
- Empty input values
- Invalid priority values
- Invalid status values
- Invalid category values
- Invalid ticket IDs
- Tickets that do not exist
- Invalid API requests

The API uses appropriate HTTP status codes, including:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
500 Internal Server Error
```

---

# Application Workflow

```text
User
  ↓
React Frontend
  ↓
Express REST API
  ↓
Mongoose
  ↓
MongoDB Atlas
```

The frontend sends requests to the Express REST API. The backend validates the request and performs the required CRUD operation in MongoDB.

---

# Main Application Sections

### Dashboard
Provides an overview of ticket information and statistics.

### All Tickets
Displays service tickets with search and filtering options.

### Create Ticket
Allows users to create a new service ticket.

### Ticket Details
Displays complete information about a selected ticket.

### Need Help
Provides guidance for using the system.

### Support Team
Displays support contact information and working hours.

---

# Support

**Email:** [harshithachandana25@gmail.com](mailto:harshithachandana25@gmail.com)  
**Phone:** +91 6364257717  
**Working Hours:** Monday – Friday, 9:00 AM – 6:00 PM

---

# Security Note

Sensitive configuration values such as MongoDB credentials must not be committed to GitHub.

The actual `.env` file is excluded from the repository.

Use:

```text
backend/.env.example
```

as the configuration template.

---

# Submission Contents

The project submission includes:

- React frontend
- Node.js/Express backend
- MongoDB/Mongoose integration
- REST API
- CRUD operations
- Validation and error handling
- Project documentation
- `.env.example`
- `.gitignore`
- README.md

The actual `.env` file and `node_modules` folders are intentionally excluded.

---

# GitHub Repository

[GitHub Repository](https://github.com/HarshithaChandana25/mini-service-ticket-management-system)

---

# Author

**Harshitha Chandana**  
Artificial Intelligence & Machine Learning

---

## Project Status

**Completed – Academic Project**
