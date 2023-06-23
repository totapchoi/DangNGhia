FROM node:16

WORKDIR /app

# Copy server files and install server dependencies
COPY package*.json ./
COPY server ./
RUN npm install

# Copy client files and install client dependencies
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

# Build Angular app
RUN npm run build -- --configuration production

# Move back to the root directory
WORKDIR /app

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]
