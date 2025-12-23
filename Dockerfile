# Use Node LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies (React + Express)
RUN npm install

# Copy the rest of the app
COPY . .

# Expose ports (change if needed)
EXPOSE 3000
EXPOSE 5173

# Run dev script
CMD ["npm", "run", "dev"]
