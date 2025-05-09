# Use Node.js Alpine image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install all dependencies (including dev dependencies)
COPY package*.json ./
RUN npm install --legacy-peer-deps  # Install dependencies including dev dependencies

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Run the app with 'dev' script (which uses 'nodemon')
CMD ["npm", "run", "dev"]