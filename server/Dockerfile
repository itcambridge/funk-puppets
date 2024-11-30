FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ sqlite sqlite-dev

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Create data directory for SQLite database
RUN mkdir -p /data && chown -R node:node /data

USER node

EXPOSE 3005

CMD ["node", "index.js"] 