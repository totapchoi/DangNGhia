# Stage 1: Build the client
FROM node:14 as client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build and run the server
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server/ ./server
COPY --from=client /app/client/dist ./client/dist
EXPOSE 5000
CMD ["node", "server/server.js"]
