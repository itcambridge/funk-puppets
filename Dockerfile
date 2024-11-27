# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    autoconf \
    automake \
    build-base \
    libtool \
    nasm \
    pkgconfig \
    python3 \
    make \
    g++

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --ignore-scripts
RUN npm rebuild

# Then copy source files
COPY . .
# Skip ESLint during build
ENV CI=false
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 