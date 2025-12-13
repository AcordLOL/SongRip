# Use the official Node.js image as the base image, using the slim "alpine" variant for a smaller image size.
FROM node:20-alpine

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present) to the working directory. 
# This allows Docker to cache the npm install step, speeding up subsequent builds.
COPY package*.json ./

# Install the application dependencies.
RUN npm install

# Copy the rest of the application code to the working directory.
COPY . .

# Expose the port the app runs on (default is often 3000).
EXPOSE 8010

# Define the command to run the application when the container starts.
CMD ["npm", "start"] 
# Alternatively, for a development server with hot-reload, you might use:
# CMD ["npm", "run", "dev"]