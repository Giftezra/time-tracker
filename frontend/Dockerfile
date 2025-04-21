# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install expo

# Copy project files
COPY . .

# Expose Expo port
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the application
CMD ["npx", "expo", "start", "--no-dev", "--minify"] 