FROM node
WORKDIR /app/backend
COPY backend/package.json /app/backend
RUN npm install
COPY . /app
CMD ["node", "index.ts"]