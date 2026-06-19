FROM node:18-alpine

# Set directory
WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install dependencies (including devDependencies needed for compiling)
RUN npm install

# Copy frontend source files
COPY . .

# Set dynamic API URL argument
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Compile Next.js, then immediately prune devDependencies and clean npm cache to save disk space
RUN npm run build \
    && npm prune --production \
    && npm cache clean --force

# Expose Next.js server port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
