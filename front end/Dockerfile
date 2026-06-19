# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set the working directory inside the builder container
WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install packages
RUN npm install

# Copy frontend source files
COPY . .

# Set dynamic API URL argument during build (e.g. your production Django domain)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js project
RUN npm run build

# Stage 2: Serve the Next.js application
FROM node:18-alpine AS runner

# Set production environment and directory
WORKDIR /app
ENV NODE_ENV=production

# Copy dependency catalogs and install only production-ready modules
COPY package*.json ./
RUN npm install --only=production

# Copy built app and public assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose Next.js server port
EXPOSE 3000

# Start server using Next.js runtime
CMD ["npm", "start"]
