FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create data directory for SQLite database
RUN mkdir -p /data && chown -R node:node /data

USER node

EXPOSE 3005

CMD ["node", "server.js"] 