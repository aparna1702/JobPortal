# Use official Node.js image as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port that your frontend runs on (5173 in your case)
EXPOSE 5173

# Run the application in development mode using npm run dev
CMD ["npm", "run", "dev"]
