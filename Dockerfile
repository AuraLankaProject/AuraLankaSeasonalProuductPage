# Use official Node.js LTS image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy backend and frontend code into container
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expose the port your server runs on
EXPOSE 3000

# Set environment variable for Node
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "backend/server.js"]
