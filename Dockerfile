# Use an official Node.js runtime as a base image
FROM node:21.6.1

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN corepack enable

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the development server
CMD ["pnpm", "dev","--host","0.0.0.0"]
