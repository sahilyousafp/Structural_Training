# Use Node.js LTS version as base for building
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files first to leverage Docker caching
COPY package*.json ./

# Install dependencies including development dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variable for output directory
ENV OUTPUT_DIR=/app/output

# Run pre-build script and build the React application
RUN node pre-build.js
RUN npm run build

# Create second stage for production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built app from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/pre-build.js ./pre-build.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create output directory for saved JSON files
RUN mkdir -p /app/deployment-package/output

# Set permissions for the output directory
RUN chmod -R 755 /app/deployment-package/output

# Set environment variable for output directory
ENV OUTPUT_DIR=/app/deployment-package/output

# Set permissions for the output directory
RUN chmod -R 755 /app/deployment-package/output

# Expose the port the app will run on
EXPOSE 3000

# Set the command to run the server
CMD ["node", "server.js"]
