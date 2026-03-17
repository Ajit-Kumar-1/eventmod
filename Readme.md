Setup instructions:
 - Run the following command to start the Docker container containing the backend, the frontend and the database servers
 docker-compose up
 - Open the front end on a browser by navigating to localhost:5173

 Event ingestion:
  - On initializing the database, a handful of sample events are generated
  - The backend includes a cron job that adds a new event to the database every minute