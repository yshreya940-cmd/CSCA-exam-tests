# Multi-stage production Dockerfile for DigitalOcean App Platform / Droplet
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json tsconfig.json vite.config.ts ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy full source tree
COPY . .

# Build Vite frontend
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package descriptors
COPY package*.json tsconfig.json ./

# Install production dependencies and tsx for server execution
RUN npm ci --omit=dev && npm install tsx

# Copy built frontend assets and server file
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/assets ./src/assets

# Expose standard web port
EXPOSE 8080

# Start server
CMD ["npx", "tsx", "server.ts"]
