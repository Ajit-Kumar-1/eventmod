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