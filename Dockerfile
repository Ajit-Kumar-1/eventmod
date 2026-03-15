FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY ui/package*.json ./ui/

RUN cd backend && npm install
RUN cd ui && npm install

COPY . .

RUN cd backend && npm test

EXPOSE 3000
EXPOSE 5173

CMD ["sh", "-c", "cd /app/backend && node index.ts & cd /app/ui && npm run dev -- --host 0.0.0.0 --port 5173 & wait -n"]