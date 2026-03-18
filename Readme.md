# EventMod

## Setup Instructions

- Run the following command to start the Docker containers for backend, frontend, and database:

```bash
docker-compose up
```

- Open the frontend in your browser at:

```text
http://localhost:5173
```

## Event Ingestion

- During database initialization, a set of sample events is generated.
- The backend includes a cron job that adds a new event every minute.

## APIs

- 1. Login
method: POST
endpoint: /login
Request body params: userId, region
Response: success message

- 2. Events
method: GET
endpoint: /events
Query params: userId
Response: List of open (available to claim), claimed and assigned events for the user

- 3. Claim
method: PUT
endpoint: /claim
Request body params: userId, eventId
Response: success message

- 4. Acknowledge
method: PUT
endpoint: /acknowledge
Request body params: userId, eventId
Response: success message

