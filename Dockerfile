FROM node
WORKDIR /app
COPY backend/package.json /app
RUN npm install
COPY . /app
CMD ["node", "backend/index.ts"]