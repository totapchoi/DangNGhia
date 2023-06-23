FROM node:14

WORKDIR /app

COPY package*.json ./
COPY server ./
RUN npm install

COPY client/dist ./client/dist

EXPOSE 5000

CMD ["node", "server/server.js"]
