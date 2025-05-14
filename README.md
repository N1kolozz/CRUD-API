# CRUD API

A simple CRUD API for managing user records with Node.js.

## Features

- RESTful API for user management
- In-memory data storage
- Input validation
- Error handling
- Horizontal scaling with load balancing

## Requirements

- Node.js v22.x.x or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/N1kolozz/CRUD-API.git
```

2. Navigate to the project directory:
```bash
cd CRUD-API
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with the following content:
```
PORT=3000
```

## Running the Application

### Development Mode

Run the application in development mode with automatic restarting on file changes:

```bash
npm run start:dev
```

### Production Mode

Build and run the application in production mode:

```bash
npm run start:prod
```

### Multi-Instance Mode with Load Balancing

Run multiple instances of the application with horizontal scaling and a load balancer:

```bash
npm run start:multi
```

## API Endpoints

### Get all users
```
GET /api/users
```
Response: 200 OK with an array of all user records

### Get user by ID
```
GET /api/users/{userId}
```
Response:
- 200 OK with user record
- 400 Bad Request if userId is invalid
- 404 Not Found if user doesn't exist

### Create a new user
```
POST /api/users
```
Request body should contain:
```json
{
  "username": "string",
  "age": number,
  "hobbies": ["string", "string", ...]
}
```
Response: 201 Created with the newly created user record

### Update a user
```
PUT /api/users/{userId}
```
Request body should contain:
```json
{
  "username": "string",
  "age": number,
  "hobbies": ["string", "string", ...]
}
```
Response:
- 200 OK with updated user record
- 400 Bad Request if userId is invalid
- 404 Not Found if user doesn't exist

### Delete a user
```
DELETE /api/users/{userId}
```
Response:
- 204 No Content if successfully deleted
- 400 Bad Request if userId is invalid
- 404 Not Found if user doesn't exist

## Running Tests

Make sure the application is running on port 3000, then execute:

```bash
npm test
```

## User Object Structure

Each user has the following properties:
- `id`: string (uuid, generated on server side)
- `username`: string (required)
- `age`: number (required)
- `hobbies`: array of strings (can be empty, required)

## Implementation Notes

- The application handles requests to non-existing endpoints with a 404 response
- Server-side errors are handled with a 500 response
- The application can run in different modes: development, production, and multi-instance
- The multi-instance mode distributes requests using a Round-robin algorithm
