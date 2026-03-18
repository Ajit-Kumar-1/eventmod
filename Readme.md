# Event Moderation Platform

## Setup Instructions

- Backend (Node.js application), frontend (React application) and the database (local PostgreSQL instance) are containerized in a single Docker container.
- Run the following command to start the Docker container:

```bash
docker-compose up
```

- Open the frontend in your browser at:
http://localhost:5173

## Event Ingestion

- Local SQL database used to store events and user data
- During database initialization, a set of sample events is generated.
- The backend includes a cron job that adds a new event every minute.

## APIs

### 1. Login

- Method: `POST`
- Endpoint: `/login`
- Request Body Params: `userId`, `region`
- Response: Success message

### 2. Events

- Method: `GET`
- Endpoint: `/events`
- Query Params: `userId`
- Response: List of open (available to claim), claimed, and assigned events for the user

### 3. Claim

- Method: `PUT`
- Endpoint: `/claim`
- Request Body Params: `userId`, `eventId`
- Response: Success message

### 4. Acknowledge

- Method: `PUT`
- Endpoint: `/acknowledge`
- Request Body Params: `userId`, `eventId`
- Response: Success message

## Design decisions and assumptions

- Moderator can only sign in to one specific region, not any region

## Features

- Background jobs, for expiring events, logging metrics and adding events to database
- Integration tests added for each route
- Simple in-memory caching of successful login credentials